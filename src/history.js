import createHistory from "history/createBrowserHistory";

const history = createHistory({
    basename: "",
    forceRefresh: false
})

export default {history}