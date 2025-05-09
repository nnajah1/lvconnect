import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "@/styles/components/switchntooltip.module.css"; 

const TooltipComponent = ({ children, text }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal className={styles.tooltipPortal}>
          <Tooltip.Content className={styles.tooltipContent} side="top">
            {text}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
    </div>
  );
};

export default TooltipComponent;
