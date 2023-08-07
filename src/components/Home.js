import { Stack, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";

import config from "../config.json";
import UsersList from "./UsersList";
import SearchBar from "./SearchBar";
import "./Home.css";

/**
 * Home Component
 * The main dashboard component displaying user data.
 * Provides search, user list, and pagination functionalities.
 * @component
 */

export default function Home() {
  // State management
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Fetch user details from the API endpoint and update the state.
   * @function
   */

  const fetchUserDetails = async () => {
    setLoading(true);

    try {
      setLoading(false);

      let response = await axios.get(config.endpoint);
      setFetchedUsers(response.data);
      setUsers(response.data);
    } catch (error) {
      setLoading(false);

      // Display an error notification if fetching fails
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line
  }, []);

  /**
   * Filters the list of users based on the provided search query.
   * The function looks for matches in user names, email addresses, or roles.
   *
   * @function
   * @param {string} searchQuery - The search query used for filtering.
   */

  const handleSearchChange = (searchQuery) => {
    const lowerCaseSearch = searchQuery.toLowerCase();

    if (lowerCaseSearch === "") {
      // Show all users when the search query is empty
      setUsers(fetchedUsers);
    } else {
      // Filter users based on search query
      const filteredUsers = fetchedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseSearch) ||
          user.email.toLowerCase().includes(lowerCaseSearch) ||
          user.role.toLowerCase().includes(lowerCaseSearch)
      );

      setUsers(filteredUsers);
    }
  };

  /**
   * Handles the deletion of a user by their ID.
   * Displays a success notification with the user's role and name upon deletion.
   *
   * @function
   * @param {string} id - The ID of the user to be deleted.
   */

  const handleDelete = (id) => {
    const deletedUser = users.filter((user) => user.id === id)[0];
    enqueueSnackbar(
      `Details of user ${deletedUser.role} ${deletedUser.name} is deleted`,
      {
        variant: "success",
      }
    );
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFetchedUsers(updatedUsers);
  };

  /**
   * Handles the deletion of selected users.
   * Displays notifications based on the outcome of the deletion process.
   *
   * @function
   */

  const handleDeleteSelected = () => {
    if (Object.keys(selectedUsers).length === 0) {
      enqueueSnackbar(`Please select the users`, {
        variant: "error",
      });
      return;
    } else {
      const updatedUsers = users.filter((user) => !selectedUsers[user.id]);
      setUsers(updatedUsers);
      setFetchedUsers(updatedUsers);
      setSelectedUsers({});
      enqueueSnackbar(`All the selected users have been deleted!`, {
        variant: "success",
      });
    }
  };

  // Pagination settings
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Stack>
      {/* Header */}
      <Box>
        <Box className="header-container">
          <Typography className="header-title" variant="span">
            Admin UI
          </Typography>
        </Box>
      </Box>

      {/* User Container */}
      <Box className="user-container">
        {/* Search Bar */}
        <Box className="search-user">
          <SearchBar search={handleSearchChange} />
        </Box>

        {/* User List */}
        {loading ? (
          // if the data is being fetched then display the Loading indicator
          <Box className="loading">
            <CircularProgress />
            <Typography variant="h5">Loading Users</Typography>
          </Box>
        ) : (
          // Display the users list when loading is complete
          <UsersList
            users={currentUsers}
            setUsers={setUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            handleDelete={handleDelete}
            currentPage={currentPage}
          />
        )}
      </Box>
      {/* Table Actions */}
      {users.length === 0 ? (
        // If no users are available, display an empty box
        <Box></Box>
      ) : (
        // Display the delete button and pagination only when users are available
        <Stack
          alignSelf="center"
          width="80%"
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          id="table-action-area"
        >
          {/* Delete Selected Button */}
          <Button
            id="delete-selected"
            sx={{
              color: "common.white",
              bgcolor: "button.danger.main",
              "&:hover": {
                bgcolor: "button.danger.dark",
              },
              borderRadius: "1rem",
            }}
            onClick={() => {
              handleDeleteSelected();
            }}
          >
            Delete Selected
          </Button>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(users.length / 10)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Stack>
  );
}
