import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const BreadcrumbNav = ({ title, categoryId }) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: "0.9rem" }}>
    <MuiLink component={Link} to="/" underline="hover" color="inherit">
      Home
    </MuiLink>
    <MuiLink component={Link} underline="hover" color="inherit">
      {categoryId?.name || "Category"}
    </MuiLink>
    <Typography color="text.primary">{title}</Typography>
  </Breadcrumbs>
);

export default BreadcrumbNav;
