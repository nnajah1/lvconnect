
function ChartLegendContent({ payload = [], nameKey = "label", valueKey = "value" }) {
  return (
    <>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-sm text-gray-700">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="truncate">{entry.payload[nameKey]}</span>
          <span className="ml-auto font-semibold">{entry.payload[valueKey]}</span>
        </div>
      ))}
    </>
  );
}

export default ChartLegendContent;
