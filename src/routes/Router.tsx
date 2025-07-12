import { Route, Switch } from "wouter";
import DeckReviewPage from "../features/deck/DeckReviewPage";
import DeckEditorPage from "../features/deck/DeckEditorPage";
import DeckListPage from "../features/deck/DeckListPage";

const Router = () => {
  return (
    <Switch>
      <Route path={"/"} children={<DeckListPage />} />
      <Route path="/deck/:deckId" component={DeckReviewPage} />
      <Route path="/edit/:deckId?" component={DeckEditorPage} />
      <Route>404 Not Found</Route>
    </Switch>
  );
};

export default Router;
