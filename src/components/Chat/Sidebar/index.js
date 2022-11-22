import { Text, View, StyleSheet } from 'react-native';
import { Button, Checkbox, List, Radio } from '@ant-design/react-native';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../../../src/store/chat';
import moment from 'moment';

const Sidebar = props => {
  const dispatch = useDispatch();

  const handleClickOrder = e => {
    dispatch(
      setFilter({
        order: e.target.checked,
      }),
    );
  };

  const handleClickMobileFirst = e => {
    dispatch(
      setFilter({
        mobileFirst: e.target.checked,
      }),
    );
  };

  const handleChangeFilterTime = e => {
    console.log(e.target.value);
    switch (e.target.value) {
      case 'today':
        dispatch(
          setFilter({
            from: moment().format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'yesterday':
        dispatch(
          setFilter({
            from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
            to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'last_7_days':
        dispatch(
          setFilter({
            from: moment().subtract(6, 'day').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'last_30_days':
        dispatch(
          setFilter({
            from: moment().subtract(29, 'day').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'this_month':
        dispatch(
          setFilter({
            from: moment().startOf('month').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'last_month':
        dispatch(
          setFilter({
            from: moment()
              .subtract(1, 'month')
              .startOf('month')
              .format('YYYY-MM-DD'),
            to: moment()
              .subtract(1, 'month')
              .endOf('month')
              .format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'this_year':
        dispatch(
          setFilter({
            from: moment().startOf('year').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
          }),
        );
        break;
      case 'last_year':
        dispatch(
          setFilter({
            from: moment()
              .subtract(1, 'year')
              .startOf('year')
              .format('YYYY-MM-DD'),
            to: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
          }),
        );
        break;
      default:
        dispatch(
          setFilter({
            from: '',
            to: '',
          }),
        );
    }
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Bộ lọc</Text>
        <Button
          type="primary"
          size="small"
          onPress={() => props.elRef.current.closeDrawer()}>
          Đóng
        </Button>
      </View>
      <View></View>
      <View style={styles.filterOldNew}>
        <Text style={styles.titleOldNew}>Sắp xếp theo</Text>
        <List.Item
          thumb={
            <Checkbox onChange={handleClickOrder}>
              <Text style={styles.textFilter}>Cũ nhất &gt; mới nhất</Text>
            </Checkbox>
          }
        />
        <List.Item
          thumb={
            <Checkbox onChange={handleClickMobileFirst}>
              <Text style={styles.textFilter}>Ưu tiên tin nhắn từ mobile</Text>
            </Checkbox>
          }
        />
      </View>
      <View style={styles.filterByTime}>
        <Text style={styles.titleTime}>Lọc theo thời gian</Text>
        <Radio.Group
          onChange={handleChangeFilterTime}
          defaultValue="last_30_days"
          style={{ paddingVertical: 12 }}>
          <Radio value={'today'}>
            <Text style={styles.textFilter}>Hôm nay</Text>
          </Radio>
          <Radio value={'yesterday'}>
            <Text style={styles.textFilter}>Hôm qua</Text>
          </Radio>
          <Radio value={'last_7_days'}>
            <Text style={styles.textFilter}>7 ngày qua</Text>
          </Radio>
          <Radio value={'last_30_days'}>
            <Text style={styles.textFilter}>30 ngày qua</Text>
          </Radio>
          <Radio value={'this_month'}>
            <Text style={styles.textFilter}>Tháng này</Text>
          </Radio>
          <Radio value={'last_month'}>
            <Text style={styles.textFilter}>Tháng trước</Text>
          </Radio>
          <Radio value={'this_year'}>
            <Text style={styles.textFilter}>Năm này</Text>
          </Radio>
        </Radio.Group>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterOldNew: {
    marginTop: 20,
  },
  titleOldNew: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterByTime: {
    marginTop: 24,
  },
  titleTime: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textFilter: {
    fontSize: 16,
  },
});

export default Sidebar;
