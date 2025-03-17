import { cn } from "@/lib/utils"; 
import logo from "@/assets/lv-logo.png";

function LVConnect({
  logoSize = "w-14 h-14",
  textSize = "text-lg md:text-2xl", 
  textColor = "text-[#1F3463]", 
  highlightColor = "text-[#36A9E1]", 
  className = "lvconnect_logo", 
}) {
  return (
    <div className={cn("flex items-center m-4", className)}>
      <img src={logo} alt="LVConnect Logo" className={cn(logoSize, "mr-2")} />
      <h1 className={cn(textSize, "font-bold leading-[40px]", textColor)}>
        <span className={highlightColor}>LV</span>
        <span className="text-sm md:text-lg font-extrabold">Connect</span>
      </h1>
    </div>
  );
}

export default LVConnect;
