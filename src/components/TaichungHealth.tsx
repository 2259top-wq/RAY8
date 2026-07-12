import RegionalHealthDashboard from './RegionalHealthDashboard';
import data from '../taichung_health_data.json';

export default function TaichungHealth() {
  const totalCount = data.reduce((acc, group) => acc + group.branches.length, 0);

  return (
    <RegionalHealthDashboard
      regionName="台中市"
      totalCount={totalCount}
      dataSource="台中市政府衛生局 第一批第三層下游業者名單"
      data={data}
      themeColor="blue"
    />
  );
}
