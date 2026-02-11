import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BreadcrumbNav = ({ title, categoryId }) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: "0.9rem" }}>
      <MuiLink component={Link} to="/" underline="hover" color="inherit">
        {content.home}
      </MuiLink>
      <MuiLink component={Link} underline="hover" color="inherit">
        {categoryId?.name || content.category}
      </MuiLink>
      <Typography color="text.primary">{title}</Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;

