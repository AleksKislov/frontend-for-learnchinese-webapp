import React, { Fragment, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Alert from "../layout/Alert";
import HskTable from "../hsk-table/HskTable";
import Words from "../hsk-table/Words";
import UserWords from "../texts/UserWords";

import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "../routing/PrivateRoute";
import TranslationForm from "../translation/TranslateForm";
import PinyinTable from "../pinyinTable/PinyinTable";
import PinyinTests from "../pinyinTable/PinyinTests";
import HskTests from "../hsk-table/HskTests";
import CreateProfile from "../profile/CreateProfile";
import EditProfile from "../profile/EditProfile";
import TranslateForm from "../translation/TranslateForm";
import NotFound from "../layout/NotFound";
import Contacts from "../layout/Contacts";
import Search from "../translation/Search";
import Posts from "../posts/Posts";
import PostPage from "../posts/PostPage";
import TextForm from "../texts/TextForm";
import Texts from "../texts/Texts";
import TextPage from "../texts/TextPage";

const Routes = () => {
  useEffect(() => {
    setPathname(window.location.pathname);
  }, [window.location.pathname]);

  const [pathname, setPathname] = useState("");

  return (
    <Fragment>
      <section
        className={pathname === "/pinyin" ? "container-fluid" : "container"}
        style={{ marginTop: "2rem", marginBottom: "3rem" }}
      >
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "60px",
            zIndex: "100",
            width: "300px"
          }}
        >
          <Alert />
        </div>

        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/hsk-words' component={Words} />
          <PrivateRoute exact path='/userwords' component={UserWords} />
          <Route exact path='/hsk-table' component={HskTable} />
          <Route exact path='/pinyin-tests' component={PinyinTests} />
          <Route exact path='/hsk-tests' component={HskTests} />
          <Route exact path='/translate' component={TranslationForm} />
          <PrivateRoute exact path='/create-profile' component={CreateProfile} />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          <PrivateRoute exact path='/translate' component={TranslateForm} />
          <Route exact path='/pinyin' component={PinyinTable} />
          <Route exact path='/search/:chinese' component={Search} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/posts' component={Posts} />
          <Route exact path='/posts/:id' component={PostPage} />
          <PrivateRoute exact path='/create-text' component={TextForm} />
          <Route exact path='/texts' component={Texts} />
          <Route exact path='/texts/:id' component={TextPage} />
          <Route exact path='/contacts' component={Contacts} />

          <NotFound />
        </Switch>
      </section>
    </Fragment>
  );
};

export default Routes;
