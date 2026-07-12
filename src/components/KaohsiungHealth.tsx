import RegionalHealthDashboard from './RegionalHealthDashboard';
import data from '../kaohsiung_health_data.json';

export default function KaohsiungHealth() {
  const totalCount = data.reduce((acc, group) => acc + group.branches.length, 0);

  return (
    <RegionalHealthDashboard
      regionName="高雄市"
      totalCount={totalCount}
      dataSource="高雄市政府衛生局 115.7.8 公告"
      data={data}
      themeColor="orange"
    />
  );
}
