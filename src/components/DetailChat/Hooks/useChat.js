import React from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';

import {
  requestGetRoomMessages,
  requestSendMessageWithAttachments
} from '../../../services/chat';

const fetchListMessage = async (headers, params) => {
  try {
    const res = await requestGetRoomMessages(headers, params);
    if (res?.status === 200) {
      return {
        messages: res.data.response.messagesPage.messages,
        nextMessage: res.data.response.messagesPage.next,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      messages: [],
      nextMessage: null,
    };
  }
};

const sendMessageWithAttachments = async (headers, data) => {
  try {
    const res = await requestSendMessageWithAttachments(headers, data);
    if (res?.status === 200) {
      return true;
    }
    throw new Error(res.data.errorMsg || 'ERROR');
  } catch (err) {
    console.log(err.toString());
    return false;
  }
};

export const useQueryMessages = (headers, { roomId, limit = 30 }) => {
  const {
    isFetching: isLoadingListMessage,
    isFetchingNextPage,
    data: dataMessages,
    fetchNextPage: onNextPageListMessage,
    hasNextPage,
    refetch: onRefreshListMessage,
  } = useInfiniteQuery(
    [`list_messages`, { roomId }],
    async ({ pageParam }) =>
      fetchListMessage(headers, {
        roomId,
        limit,
        next: pageParam,
      }),
    {
      getNextPageParam: params => {
        const nextCursor = params?.nextMessage;
        return nextCursor || undefined;
      },
      select: data => {
        const result = data.pages.reduce((r, page) => {
          let clone = r;
          if (page.messages.length > 0) {
            clone = [...clone, ...page.messages];
          }
          return clone;
        }, []);
        let lastMid = null;
        if (
          data.pages[data.pages.length - 1].messages[
            data.pages[data.pages.length - 1].messages.length - 1
          ]
        ) {
          lastMid =
            data.pages[data.pages.length - 1].messages[
              data.pages[data.pages.length - 1].messages.length - 1
            ].mid;
        }
        return {
          data: result,
          lastMid,
        };
      },
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );

  return {
    loading: isLoadingListMessage,
    isFetchingNextPage,
    hasNextPage,
    listMessage: dataMessages?.data || [],
    onNextPageListMessage,
    onRefreshListMessage,
  };
};

export const useMutationChat = (headers, { roomId }) => {
  const queryClient = useQueryClient();

  const refetchListMessage = React.useCallback(() => {
    try {
      queryClient.invalidateQueries(['list_messages'], { roomId });
    } catch (err) {
      console.error(err);
    }
  }, [queryClient, roomId]);

  const uploadFileMutationAsync = useMutation(
    data => {
      return sendMessageWithAttachments(headers, data);
    },
    {
      onSettled: async () => {
        refetchListMessage();
      },
    },
  );

  const appendLogAction = React.useCallback(
    async ({ roomId, message, ...restAction }) => {
      const key = ['list_messages', { roomId }];
      await queryClient.cancelQueries(key);

      const previousData = queryClient.getQueryData(key);
      queryClient.setQueryData(key, old => {
        const messageList = []
          .concat(...(old?.pages || []).map(d => d?.messages))
          .filter(Boolean);
        if (message && Object.keys(message)?.length > 0) {
          message.messageReply = null;
          message.midReply = null;
          message.actionRoomDtos = (message?.actionRoomDtos ?? []).concat({
            ...restAction,
            mid: message?.mid,
          });
          messageList.push(message);
        } else {
          if (messageList?.length === 0) {
            messageList.push({});
          }
          const lastMessage = messageList[messageList.length - 1];
          lastMessage.actionRoomDtos = (
            lastMessage?.actionRoomDtos ?? []
          ).concat({
            ...restAction,
            mid: lastMessage?.mid,
          });
        }
        return {
          ...old,
          pages: [
            {
              messages: messageList,
            },
          ],
        };
      });
      return { previousData };
    },
    [queryClient],
  );

  return {
    sendMessageWithAttachments: {
      onSendMessage: uploadFileMutationAsync.mutateAsync,
      loading: uploadFileMutationAsync.isLoading,
    },
    onRefetchListMessage: refetchListMessage,
    onAppendLogAction: appendLogAction,
  };
};
