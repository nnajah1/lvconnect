
import * as Tabs from "@radix-ui/react-tabs";

const DynamicTabs = ({ tabs = [], activeTab, onTabChange, className = "" }) => {
  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange} className={`w-full ${className}`}>
      <Tabs.List
        className="flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1 sm:gap-1 pb-2"
      >
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded min-w-max hover:bg-gray-100 data-[state=active]:bg-[#2CA4DD] data-[state=active]:text-white bg-white transition-colors"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="outline-none mt-2"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};


export default DynamicTabs;
