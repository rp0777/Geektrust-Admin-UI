import React from "react";
import TextField from "@mui/material/TextField";

import "./SearchBar.css";

/**
 * Search Bar Component
 * @component Search Bar Component
 * @example
 *
 * Usage example :
 * const [search, setSearch] = useState("");
 * <SearchBar search0={search} setSearch={setSearch} />
 */

export default function SearchBar({ search }) {
  return (
    <TextField
      sx={{ borderRadius: "10px" }}
      id="search-bar-input"
      placeholder="Search by Name, Email or Role"
      type="search"
      onChange={(e) => {
        search(e.target.value);
      }}
      variant="outlined"
      fullWidth
    />
  );
}
