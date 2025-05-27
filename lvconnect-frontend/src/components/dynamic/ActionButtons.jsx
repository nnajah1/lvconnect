
// import { Button } from "@/components/ui/button";

// export function ActionButtons({ item, actions, userRole, context }) {
//     const applicableActions = Object.entries(actions)
//         .filter(([actionName, condition]) => 
//             condition ? condition(item, userRole, context) : true
//         )
//         .map(([actionName, actionFn]) => (
//             <Button
//                 key={actionName}
//                 variant={actionName === "delete" ? "destructive" : "outline"}
//                 size="sm"
//                 onClick={() => actionFn(item.id, item)}
//             >
//                 {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
//             </Button>
//         ));

//     return <div className="flex space-x-2">{applicableActions}</div>;
// }
