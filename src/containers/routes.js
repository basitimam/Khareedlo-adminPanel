// import App from './App';
import Dashboard from "./Dashboard/Dashboard.index";
import UserTableContainer from "../containers/Table/UserTable.index";
import ProductTableContainer from "../containers/Table/ProductTable.index";
import OrderTableContainer from "../containers/Table/OrderTable.index";
import Charts from "./Charts/Charts.index";
// import UnitExplorer from '../Explorer/UnitExplorer';

// router configuration.
let routes = [
  // {
  //   path: "/dashboard",
  //   name: "Project Dashboard",
  //   component: Dashboard,
  //   exact: true,
  //   strict: true,
  // },
  {
    path: "/dashboard/users",
    name: "Table",
    component: UserTableContainer,
    exact: true,
    strict: true,
  },
  {
    path: "/dashboard/products",
    name: "Table",
    component: ProductTableContainer,
    exact: true,
    strict: true,
  },
  {
    path: "/dashboard/orders",
    name: "Table",
    component: OrderTableContainer,
    exact: true,
    strict: true,
  },
  // {
  //   path: "/dashboard/charts",
  //   name: "Charts",
  //   component: Charts,
  //   exact: true,
  //   strict: true,
  // },
];

export default routes;
