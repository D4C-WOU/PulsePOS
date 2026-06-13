import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiClock,
} from "react-icons/fi";

import AnalyticsCard from "./AnalyticsCard";

const AnalyticsCards = () => {
  const analytics = [
    {
      title: "Revenue Today",
      value: "₹14,500",
      icon: <FiDollarSign />,
      trend: "+12%",
      positive: true,
    },
    {
      title: "Orders",
      value: "43",
      icon: <FiShoppingBag />,
      trend: "+8%",
      positive: true,
    },
    {
      title: "Tables Occupied",
      value: "8",
      icon: <FiUsers />,
      trend: "+5%",
      positive: true,
    },
    {
      title: "Kitchen Queue",
      value: "2",
      icon: <FiClock />,
      trend: "-15%",
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {analytics.map((item, index) => (
        <AnalyticsCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          trend={item.trend}
          positive={item.positive}
        />
      ))}
    </div>
  );
};

export default AnalyticsCards;