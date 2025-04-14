
import * as Tabs from "@radix-ui/react-tabs";

const DynamicTabs = ({ tabs = [], className = "" }) => {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} className={`w-full ${className}`}>
      <Tabs.List className="flex pb-2">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 data-[state=active]:bg-[#2CA4DD] data-[state=active]:text-white bg-white "
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="outline-none">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default DynamicTabs;
