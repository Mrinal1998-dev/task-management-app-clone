import React from "react";

const AuthContext = React.createContext();
const SearchContext = React.createContext();

const LoaderContext  = React.createContext();

const FocusedDrawerItemContext = React.createContext()

const TasksContext = React.createContext();
const UserContext = React.createContext();

export {
    AuthContext,
    SearchContext,
    LoaderContext,
    FocusedDrawerItemContext,
    TasksContext,
    UserContext
};