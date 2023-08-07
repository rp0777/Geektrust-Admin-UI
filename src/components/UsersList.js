import React from "react";
import { useSnackbar } from "notistack";
import {
  Checkbox,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Input,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import "./UsersList.css";

/**
 * UsersList Component
 * Renders a list of users in a table format, allowing interaction with user data.
 * Provides functionalities for selecting, editing, and deleting users.
 * @component
 * @param {Array} users - The list of user objects to be displayed.
 * @param {function} setUsers - The function to update the list of users.
 * @param {function} handleDelete - The function to handle user deletion.
 * @param {Object} selectedUsers - An object storing the selected user IDs as keys.
 * @param {function} setSelectedUsers - The function to update the selectedUsers object.
 * @param {number} currentPage - The current page number for pagination.
 */

export default function UsersList({
  users,
  setUsers,
  handleDelete,
  selectedUsers,
  setSelectedUsers,
  currentPage,
}) {
  // State management
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handles the "Select All" checkbox toggle for selecting all users.
   * Updates the selectedUsers object based on the checkbox status.
   * @function
   */

  const handleSelectAll = () => {
    const newSelectedUsers = {};
    if (!selectAllChecked) {
      users.forEach((user) => {
        newSelectedUsers[user.id] = true;
      });
    }
    setSelectedUsers(newSelectedUsers);
    setSelectAllChecked(!selectAllChecked);
  };

  /**
   * Toggles the selection status of a user.
   * Updates the selectedUsers object based on user selection.
   * @function
   * @param {string} userId - The ID of the user being selected or deselected.
   */

  const selectUser = (userId) => {
    const newSelectedUsers = { ...selectedUsers };
    newSelectedUsers[userId] = !newSelectedUsers[userId];
    setSelectedUsers(newSelectedUsers);
  };

  /**
   * Clears the selected users and the "Select All" checkbox status when the page changes.
   */

  useEffect(() => {
    setSelectedUsers({});
    setSelectAllChecked(false);
    // eslint-disable-next-line
  }, [currentPage]);

  /**
   * Handles the initiation of user information editing.
   * Sets the editingUserId state to the ID of the user being edited.
   *
   * @function
   * @param {Object} user - The user object to be edited.
   */

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
  };

  /**
   * Handles the completion of user information editing.
   * Clears the editingUserId state to exit edit mode and displays a success notification.
   *
   * @function
   * @param {Object} editedUser - The user object with the updated information.
   */

  const handleEditSave = (editedUser) => {
    setEditingUserId(null);
    enqueueSnackbar(`User details of ${editedUser.name} has been updated`, {
      variant: "success",
    });
  };

  /**
   * UserEditableInfo function
   * Renders an editable cell for user information within the UsersList table.
   * Displays an input field for editing when in edit mode, or plain text when not in edit mode.
   *
   * @function
   * @param {Object} user - The user object containing user information.
   * @param {string} field - The field (property) of the user object being edited.
   * @param {number} widthFactor - A factor to determine the input field width based on content length.
   * @returns {JSX.Element} - The rendered component representing the user information cell.
   */

  const UserEditableInfo = (user, field, widthFactor) => {
    /**
     * Handles changes to the user information field.
     * Updates the user's information in the state when the field value changes.
     *
     * @function
     * @param {Event} event - The input change event.
     * @param {string} id - The ID of the user being edited.
     */

    const handleFieldChange = (event, id) => {
      const value = event.target.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (field === "email" && !emailRegex.test(value)) {
        // Display an error notification for invalid email format
        enqueueSnackbar(
          `Please enter a valid email addres (Eg: 'example123@email.com')`,
          { variant: "error" }
        );
        return;
      }

      // Update the list of users with the edited information
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      );

      // Update the users state with the modified list
      setUsers(updatedUsers);
    };

    return (
      <React.Fragment>
        {editingUserId === user.id ? (
          // Render an input field in edit mode
          <TableCell>
            <Input
              id={`name-input-${user.id}`}
              value={user[field]}
              onChange={(event) => {
                handleFieldChange(event, user.id);
              }}
              style={{
                height: "2rem",
                width: `${user[field].length * widthFactor}rem`,
              }}
            />
          </TableCell>
        ) : (
          // Render plain text (user details) in non-edit mode
          <TableCell align="left">{user[field]}</TableCell>
        )}
      </React.Fragment>
    );
  };

  return (
    <Paper sx={{ width: "90%", mb: 2 }}>
      <TableContainer>
        <Table size="small">
          {/* Table header row */}
          <TableHead>
            <TableRow sx={{ "border-bottom": "2px solid black" }}>
              <TableCell align="left">
                {/* "Select All" checkbox */}
                <Checkbox
                  color="primary"
                  inputProps={{
                    "aria-label": "select-all-users",
                  }}
                  onClick={handleSelectAll}
                  checked={selectAllChecked}
                />
              </TableCell>

              {/* User Details Header */}
              <TableCell
                align="left"
                sx={{ textIndent: "15px", height: "30px" }}
              >
                <strong> Name</strong>
              </TableCell>
              <TableCell
                align="left"
                sx={{ textIndent: "15px", height: "30px" }}
              >
                <strong>Email</strong>
              </TableCell>
              <TableCell align="center" sx={{ height: "30px" }}>
                <strong>Role</strong>
              </TableCell>

              {/* Table Actions Header */}
              <TableCell align="center" sx={{ height: "30px" }}>
                <strong>Action</strong>
              </TableCell>
              <hr />
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Render each user row */}
            {users.map((user) => (
              <TableRow
                hover
                role="checkbox"
                key={user.id}
                sx={{
                  height: 60,
                  cursor: "pointer",
                  backgroundColor: `${
                    selectedUsers[user.id] ? "#f2f2f2" : "transparent"
                  }`,
                }}
                onClick={() => {
                  selectUser(user.id);
                }}
              >
                {/* Checkbox for user selection */}
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={selectedUsers[user.id] || false}
                    onChange={() => {
                      selectUser(user.id);
                    }}
                    inputProps={{
                      "aria-label": "select-all-users",
                    }}
                  />
                </TableCell>

                {/* Render editable user details */}
                {UserEditableInfo(user, "name", 0.5)}
                {UserEditableInfo(user, "email", 0.6)}
                {UserEditableInfo(user, "role", 0.7)}

                {/* Table Action Buttons */}
                <TableCell align="center">
                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    spacing={1}
                  >
                    {editingUserId === user.id ? (
                      // Saving Button
                      <IconButton
                        aria-label="edit"
                        size="large"
                        label={user.id}
                        sx={{ color: "button.success.main" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditSave(user);
                        }}
                      >
                        <SaveIcon fontSize="inherit" />
                      </IconButton>
                    ) : (
                      // Editing Button
                      <IconButton
                        aria-label="edit"
                        size="large"
                        label={user.id}
                        sx={{ color: "button.success.main" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditClick(user);
                        }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    )}

                    {/* Delete Button */}
                    <IconButton
                      aria-label="delete"
                      size="large"
                      label={user.id}
                      sx={{ color: "button.danger.main" }}
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteOutlineIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
