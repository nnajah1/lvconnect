import * as React from "react";
import * as Switch from "@radix-ui/react-switch";
import styles from "@/styles/components/switchntooltip.module.css"; 

const SwitchComponent = ({ label, checked, onCheckedChange }) => {

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{label}</span>
          <Switch.Root
            className={styles.switchRoot}
            checked={checked}
            onCheckedChange={onCheckedChange}
          >
            <Switch.Thumb className={styles.switchThumb} />
          </Switch.Root>
        </div>
      );
};

export default SwitchComponent;
