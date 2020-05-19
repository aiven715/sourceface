import React, { useState } from "react"
import cx from "classnames"
import { useMediaQuery } from "react-responsive"
import { breakpoints } from "@sourceface/style"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Burger from "@sourceface/components/burger"
import Dropdown from "@sourceface/components/dropdown"
import Header from "@sourceface/components/header"
import Nav from "@sourceface/components/nav"
import Sidebar from "@sourceface/components/sidebar"
import ContentIcon from "assets/content-line.svg"
import GroupIcon from "assets/group-line.svg"
import LockIcon from "assets/lock-line.svg"
import QuestionIcon from "assets/question-line.svg"
import SettingsIcon from "assets/settings-line.svg"
import ShieldIcon from "assets/shield-line.svg"
import StackIcon from "assets/stack-line.svg"
import styles from "./index.scss"

// Pages menu may be left sliding
// User menu may be right sliding
// when clicking on a user item in the list - display select list modal?

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Settings",
    link: "/settings",
  },
  {
    name: "Users",
    link: "/settings/users",
  },
  {
    name: "Team",
    link: "/settings/users/team",
  },
]

// will be getting current page object from Page provided context and depending on it will render the data in breadcrumbs and sidebar
export default ({ children }) => {
  const isLargeSize = useMediaQuery({ minWidth: breakpoints.lg })

  return isLargeSize ? <Large>{children}</Large> : <Initial>{children}</Initial>
}

function Initial({ children }) {
  const [leftMenuActive, setLeftMenuActive] = useState(false)
  const [rightMenuActive, setRightMenuActive] = useState(false)

  return (
    <div
      className={cx(
        styles.root,
        leftMenuActive && styles.leftMenuActive,
        rightMenuActive && styles.rightMenuActive
      )}
    >
      {leftMenuActive && <Sidenav />}
      {rightMenuActive && <ProfileMenu />}
      <Burger
        className={styles.burger}
        isActive={leftMenuActive}
        size="compact"
        appearance="dark"
        onClick={() => setLeftMenuActive(!leftMenuActive)}
      />
      <Header className={styles.header} size="compact">
        Users management
        <Avatar
          onClick={() => setRightMenuActive(!rightMenuActive)}
          value="A"
        />
      </Header>

      <div className={styles.main}>{children}</div>
    </div>
  )
}

function Large({ children }) {
  return (
    <div className={styles.root}>
      <Sidenav />
      <Header className={styles.header}>
        <Breadcrumbs items={items} />
        <Dropdown>
          <Dropdown.Trigger>
            <button className={styles.avatar}>
              <Avatar value="A" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Header>
      <div className={styles.main}>{children}</div>
    </div>
  )
}

function Sidenav() {
  return (
    <>
      <Nav appearance="dark" className={styles.nav}>
        <Nav.Logo />
        <Nav.Link href="#">
          <ContentIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <QuestionIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <StackIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <SettingsIcon />
        </Nav.Link>
      </Nav>
      <Sidebar appearance="dark" className={styles.sidebar}>
        <Sidebar.Title>Settings</Sidebar.Title>
        <Sidebar.Group>
          <Sidebar.GroupTitle>Personal</Sidebar.GroupTitle>
          <Sidebar.GroupLink href="#" iconBefore={<ShieldIcon />}>
            Security
          </Sidebar.GroupLink>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupTitle>Organization</Sidebar.GroupTitle>
          <Sidebar.GroupLink href="#" iconBefore={<GroupIcon />} isSelected>
            Users management
          </Sidebar.GroupLink>
          <Sidebar.GroupLink href="#" iconBefore={<LockIcon />}>
            Access management
          </Sidebar.GroupLink>
        </Sidebar.Group>
      </Sidebar>
    </>
  )
}

function ProfileMenu() {
  return (
    <Sidebar appearance="light" className={styles.profile}>
      <Sidebar.Title>Profile</Sidebar.Title>
      <Sidebar.GroupLink href="#" iconBefore={<ShieldIcon />}>
        Sign out
      </Sidebar.GroupLink>
    </Sidebar>
  )
}
