
import * as Tabs from "@radix-ui/react-tabs"

const DynamicTabs = ({ tabs = [], activeTab, onTabChange, className = "" }) => {
  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange} className={`w-full ${className}`}>
      <Tabs.List className="flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1 sm:gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-1 font-semibold rounded-md min-w-max text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="outline-none mt-2">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default DynamicTabs
