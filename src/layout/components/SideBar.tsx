import { FunctionComponent, useCallback, MouseEvent } from "react";
import {
  Stack,
  Divider,
  Drawer,
  DrawerProps,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import { useAppStore } from "@/store";
import { LinkToPage } from "@/utils";
import {
  useEventLogout,
  useEventSwitchDarkMode,
  useIsAuthenticated,
  useIsMobile,
} from "@/hooks";
import { AppIconButton, UserInfo } from "@/components";
import { SIDE_BAR_WIDTH, TOP_BAR_DESKTOP_HEIGHT } from "../config";
import SideBarNavList from "./SideBarNavList";

export interface SideBarProps
  extends Pick<
    DrawerProps,
    "anchor" | "className" | "open" | "variant" | "onClose"
  > {
  items: Array<LinkToPage>;
}

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 * @param {string} anchor - 'left' or 'right'
 * @param {boolean} open - the Drawer is visible when true
 * @param {string} variant - variant of the Drawer, one of 'permanent', 'persistent', 'temporary'
 * @param {function} onClose - called when the Drawer is closing
 */
const SideBar: FunctionComponent<SideBarProps> = ({
  anchor,
  open,
  variant,
  items,
  onClose,
  ...restOfProps
}) => {
  const [state] = useAppStore();
  // const isAuthenticated = state.isAuthenticated; // Variant 1
  const isAuthenticated = useIsAuthenticated(); // Variant 2
  const onMobile = useIsMobile();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleAfterLinkClick = useCallback(
    (event: MouseEvent) => {
      if (variant === "temporary" && typeof onClose === "function") {
        onClose(event, "backdropClick");
      }
    },
    [variant, onClose],
  );

  return (
    <Drawer
      anchor={anchor}
      open={open}
      variant={variant}
      PaperProps={{
        sx: {
          width: SIDE_BAR_WIDTH,
          marginTop: onMobile
            ? 0
            : variant === "temporary"
              ? 0
              : TOP_BAR_DESKTOP_HEIGHT,
          height: onMobile
            ? "100%"
            : variant === "temporary"
              ? "100%"
              : `calc(100% - ${TOP_BAR_DESKTOP_HEIGHT})`,
        },
      }}
      onClose={onClose}
    >
      <Stack
        sx={{
          height: "100%",
          padding: 2,
        }}
        {...restOfProps}
        onClick={handleAfterLinkClick}
      >
        {isAuthenticated && (
          <>
            <UserInfo showAvatar />
            <Divider />
          </>
        )}

        <SideBarNavList items={items} showIcons />

        <Divider />

        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Tooltip
            title={
              state.darkMode ? "Switch to Light mode" : "Switch to Dark mode"
            }
          >
            <FormControlLabel
              label={!state.darkMode ? "Light mode" : "Dark mode"}
              control={
                <Switch checked={state.darkMode} onChange={onSwitchDarkMode} />
              }
            />
          </Tooltip>

          {isAuthenticated && (
            <AppIconButton
              icon="logout"
              title="Logout Current User"
              onClick={onLogout}
            />
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SideBar;
