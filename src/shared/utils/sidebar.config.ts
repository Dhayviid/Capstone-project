import {
  MdOutlineDashboard,
  MdOutlineCheckBox,
  // MdOutlineFolder,
  MdOutlineGroup,
  // MdOutlineShare,
  // MdOutlineBarChart,
  MdOutlineNotifications,
} from "react-icons/md";
import type { IconType } from "react-icons";

export type SidebarLink = {
  label: string;
  path: string;
  icon: IconType;
};

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/dashboard",
  },
  {
    label: "Tasks",
    icon: MdOutlineCheckBox,
    path: "/task",
  },
  {
    label: "Team",
    icon: MdOutlineGroup,
    path: "/team",
  },
  // {
  //   label: "Files",
  //   icon: MdOutlineFolder,
  //   path: "/files",
  // },
  // {
  //   label: "Sharing",
  //   icon: MdOutlineShare,
  //   path: "/sharing",
  // },
  // {
  //   label: "Activity",
  //   icon: MdOutlineBarChart,
  //   path: "/activity",
  // },
  {
    label: "Notifications",
    icon: MdOutlineNotifications,
    path: "/notifications",
  },
];

export default sidebarLinks;
