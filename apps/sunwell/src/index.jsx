import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import { ClientProvider } from "packages/client"
import * as pages from "./pages"
// import Grid from "./packages/grid/examples"

ReactDOM.render(
  <ClientProvider>
    <BrowserRouter>
      <Route exact path="/">
        Home
      </Route>
      <Route exact path="/e/:path*">
        <pages.Construction />
      </Route>
    </BrowserRouter>
  </ClientProvider>,
  document.getElementById("root")
)

// TODO:
// Implement controllers feature where user can define server executed code with engine lang
//
// Consider having ability to execute the action pipeline before every module loads so we can populate the module with data from action.
// It might work with nested modules(containers and modals) so we can execute operation for example and nested inputs will have data on first load
// (that feature might be front-end only, can it theoretically be implemented on a specific module side?)
// Should that feature be application-wise or only for container and modal?
// It might be implemented application-wise as another non configurable configuration section
//
// Fix layouts/positions data structure.
//
// Module is having page_id instead of layout_id
// Remove layouts table
// Page will have "layout" column
// Module will have "layouts" column
//
// Use avatars generator to make initial avatars for the users
//
// Introduce presets
//
// Implement "Save/Cancel" logic on the frontend.
// - Make sure all module/action updates are optimistic
// - Fix all cache updates of modules/actions.
// - Implement action removal
// - Investigate extra fields in populate mutation and warnings after updateModule optimistic updates.(check it's file for details)
//   - Consider not using populate(returning fields really changed on server) directive and also moving all mutations in the app since it's return
//   fields might be app specific.
//   - Consider moving client to schema?
//
// consider having json db for keeping config data?
//
// consider implementing auto app upgrade feature
//
// What should happen if module/page/operation(any other relation) mentioned in the action chain gets removed? Should we restrict the deletion and show a message with depending data?
//
// Have connection between action relations json and actual postgres data to maintain data integrity. Also keep that approach in the rest application parts where we reference entities inside of a json
//
//
// User should be able to click+move empty area to capture selection rectangle and select multiple modules
//
// use case - user need to be able to create postgres table in the app. either with "arbitrary query" for example(with predefined queries for table etc), or have a feature to manage source entities in addition to queries.
//
// Implement version forking in the app where app might have multiple versions and we can create new version based on the existing one by copying it's database with data to a new db. For the case when user need to implement
// a big feature in the app and then publish it.
//
// Implement editor edition history so use can jump back to a specific item in the timeline like in p?
//
// think of the app conception. generic use cases are:
// - be admin(management) app for existing application with existing database (internal admin app for the existing startup)
// - be admin(management) app created from scratch and empty database (internal application for managing candidates hiring process for a startup)
// - be a regular app created from scratch, where users in the admin are related with users from external db. (external hospital app where we can query appointments for the "admin app" user. where patients are a users of the "admin app")
//
// Implement parallel action execution where we can execute multiple actions in one action step(will have n amount of vertical lines for n concurrent actions in the UI between the items with ability to choose current selected action for the ability to edit it by clicking on vertical line)
// Handle multiple action pipiline branches. (parallel execution, error handling or conditional execution). Have "+" hovered button on the right side of the last line to create a new branch. Branch type edition(condition, try/catch or parallel) will be configured in the action card area
//
// Implement variable types. When creating a module, need to define scope type. Also type will need to be defined for other places - operation results, function arguments and so on. Literally every variable should have type
//
// Input module configuration
// - validation is performed via regex. user can provide custom regex, or configure validation by choosing required, type(number only), limit, email and other settings and we will create corresponding regex for that(find a library)
// Table module configuration
// - Total count and current page are required and by default will have internal variables as values
// - Scope variables circular dependencies
// - Think of having generic way for providing string and other data type input, since it's inconsistent for the user to have 2 inputs(template and expression)
//   - If braces are provided - then consider as template, otherthise as expression
//    - How to allow a user provide a string to input by default not surrounded by quotes? Dirty solution is to separate expressions and templates and provide ability to switch with a checkbox
// - Table row click action
// Add other modules? Input, Button
// Improve / Change editor UI? start with a feature approach
// Pages
// Performance optimizations
// Investigate race conditions with optimistic updates and debouncing. Additionally in the context of mutations
// Editor design(keep in mind mobile first approach)
//  - Consider having page editing in the in-place modal like drop down(and also all similar features, like query editing and so on?) instead of modals
//  - Permissions will be defined in editor for every command(because they're related to the commands)?
//    - Creating groups will be near users but assigning command to a group will be in command "permissions" tab
//    - TODO: rethink permissions, might need to set only on module level.
//  - In top right are probably display spinner icon indicating that something is saving
//  - Have multiple selections of modules?
//  - Have ability to duplicate the module(useful for example when creating form inputs)
//  - Have frame mode in any view including desktop. Where content is located inside a frame having width of selected viewport and background is having different appearance from the content area. That frame width is freely resizable.
//  - Should edit mode be triggered from global area(header or something), instead of page area(right now it's in the right side of breadcrumbs). Since we'll have pages and queries management in the editor and it's not related to the specific page.
//  - Pages and menu list edition/creation will be inline. No need to have separate pages/modals for that. Page list will be in editor select, creation can be done with "+" button. Menu creation will be in-place as well, without need of a separate page. When user is having edit mode enabled, on the sidebar side, we display menu area with "+" button downwards(even there are no menus created yet) so user have ability to create menu items. When edit mode is disabled, user can not edit menu items and menu is hidden if there are no items created. On hovering menu item, user can edit it's name(how to change link, should it have the same interface of defining page url?) and delete
//
// Cache logged in user information in the local storage in order not to display global loader when application is loaded.
//
// Modules
// - add uuid as id to modules. (after that modules can be created instantly with optimistic updates)
//
// Modules state
// - 2 way binding vs 1 way binding, what's better? probably 2 way. Most likely it will be done similar to redux with global state
//
// Validations
// - Have ability to create validation schemas to validate the data
// - yup under the hood
//
// Pipelines
// - It will be a separate feature in the same row with Sources or Pages which will allow to combine multiple actions into one. Also will have another prefix in "funcs" of the engine's scope - "pipelines".
// Alternative of that feature - is custom JS. So user can define it's own functions to use in modules.(JS might not be a good fit since pipelining is pretty common situtation, and it's not a great idea to make user write JS code all the time)
// Whether pipelines are defined globally(resuable) or locally(inline in the place we use engine code)
// Pipelines can be defined sequentially or asynchronously(like Promise.all)
// Real world use case: get data from one API then from second API then combine to a single object and display it in the UI
//
// Dependent queries
// - Once one query will be executed, a set of queries which needs to be executed afterwards might be specified. (invalidation)
//
// Queries presets
// - When creating new query, user can choose predefined preset depending on source type. For example user need to add createOrder query, he choose "INSERT" preset and asked to enter creation fields, which will generate insert query
//
// Consider having slots. One slot(position in back-end) might have multiple modules. Only one module might be visible in a slot at a time using a condition. For example when rows in a table are selected - display delete button, otherwise another module. Or depending on user role - display different module.
//
// Current:
// - Pipelines
// - Cache update after queries application
//   When creating a query, it is possible to optionally define how cache will be updated after it will be executed successfully.
//   - Can be defined item Type returned. and change - link/unlink. There would be no action defined such as "create", "delete" or "update"
// - Implement custom variables support:
//   1. As bindings.  Just have a blueprint of what key corresponds to what value in the scope. For example:
//     - custom.form.foo -> modules.foo
//     - custom-form.bar -> modules.bar
//   2. As custom object. Every function in the engine scope returns object which describes what should be done after, it could be query call, redirect, notification display and so on
// - Implement form support
//    - alternative form implementation:
//      - Forms are created within separate page. User will need to provide field names, for each name - validation rules and module name
//      - Modules will need to implement public interface with the following:
//        - value.
//        - setValidationMessage(onValidationFailure/validationFailed).
//      - When clicking submit button, `forms.name.validate` function will be called, in case of failed validation will call `setValidationMessage` for every invalid field.
//
//    - alternative form implementation 2
//      - Validation rules are provided for every module(with regexp)
//      - Modules will need to implement public interface:
//        - value
//        - validate
//        or
//        - readValue. in case of success - gives value, otherwise throws and shows validation message internally
//      - When clicking submit button, `core.call fn: 'validate/readValue', [module1, module2, module3]` or `core.validate [module1, module2, module3]` is called, which will call `readValue` for every module and on success will return data object(TODO: how to map modules to arguments object to the next function in the pipe? probably by passing named object to `core.call`, which is created in the "scope" section of button module. It is possible to create nested object(TODO: implement module custom variables feature?)).
//      pipes:
//      `core.map data: form, fn: 'read'`(`map` either accepts object or list, will return the same data structure with a result as given)
//      `...form -> queries.createOrder ...form` or `queries.createOrder`
//
//   // TODO: how to higlight invalid inputs when "core.validate" is used? Referencing input by usage of validation schema might not work,
//   since the same schema might be used in another module and will be highlighted accidentally.
//   // TODO: should Validations be created globally or locally?
//   - Inline pipelines
//     - -> core.validate data: state.orderForm, schema: schemas.order
//     - -> queries.createOrder data: state.orderForm
//     - -> core.navigate to: '/orders'
//   - Global Validation schemas conception
//   - Global state support
//   - Defining value and change handler on the input(by default will be used internal ones)
//   - Defining validation schema for the input field(will use schema defined globally)
// - Multiple pages support
// - Find various simple real world use-cases
//
// - Modules moving from one grid to another within nested grid doesn't work
//  - Ensure optimistic update works
//  - Ensure position is removed from the layout on back-end
// - Grid size is not updated when parent module is resized
//
// - Improve ux of modules editing
//
// - Cache in local storage all data fetched during initial app load in order to speed up page loading process. Then fetch that data in background after app loaded.
//
// - Consider using pg-bouncer
//
// - Tests:
//   Consider writing module tests instead of e2e or all-in snapshot tests?
//
// - Engine:
//   - pattern object path selection
//   - rewrite evaluation algorithm to be able parse code to AST. code -> AST. AST -> code.
//   - Keep AST in database. That will let to rename modules names and assign permissions with query calls.
// - Modules
//   - Module names with creation
//   - Implement multiple regex validations
//   - Implement select field module
//   - Implement modals support and global area(in top left side with bookmark box contained them and list appearing on hover)
