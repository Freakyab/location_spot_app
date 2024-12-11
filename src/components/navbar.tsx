import { Briefcase, Contact, Home, MapPin, Search, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context.tsx";
import { fetchSavedSearch, favoriteSearch, login } from "../action.tsx";

function Navbar({
  isFocusSearch,
  setIsFocusSearch,
  setSearch,
}: {
  isEnable: boolean;
  setIsEnable: (value: boolean) => void;
  isFocusSearch: boolean;
  setIsFocusSearch: (value: boolean) => void;
  setSearch: (value: string) => void;
}) {
  interface Search {
    address: string;
    type: string;
    favorite: boolean;
  }

  const [tempSearch, setTempSearch] = useState<string>("");
  const [savedSearch, setSavedSearch] = useState<Search[]>([]);
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { userDetails, handleSavingUserDetails } = useAuth();
  const [isMouseIn, setIsMouseIn] = useState(false);

  useEffect(() => {
    if (userDetails.token) {
      fetchSavedSearch(userDetails.token).then((data) => setSavedSearch(data));
    }
  }, [userDetails.token]);

  const getTypedAddress = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="text-gray-600" />;
      case "work":
        return <Briefcase className="text-gray-600" />;
      case "friend":
        return <Contact className="text-gray-600" />;
      default:
        return <MapPin className="text-gray-600" />;
    }
  };

  const handleSelectSearch = (address: string) => {
    if (!address || tempSearch === address) {
      setIsDropdownVisible(false);
      return;
    }
    console.log(address, tempSearch);
    setTempSearch(address);
    setSearch(address);
    setTimeout(() => setIsDropdownVisible(false), 200);
  };

  const handleFavoriteSearch = async (
    event: React.MouseEvent,
    address: string
  ) => {
    event.stopPropagation();
    if (!userDetails.token) return;
    favoriteSearch(address, userDetails.token).then((success) => {
      if (success) {
        setSavedSearch(
          savedSearch.map((item) =>
            item.address === address
              ? { ...item, favorite: !item.favorite }
              : item
          )
        );
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // close the keyboard on mobile
    const input = document.activeElement as HTMLElement;
    if (input) input.blur();

    setSearch(tempSearch);
    setIsDropdownVisible(false);
    setRecentSearch((prev) => {
      if (prev.includes(tempSearch)) return prev;
      return [tempSearch, ...prev].slice(0, 5);
    });
  };

  const onSuccess = async (res: CredentialResponse) => {
    if (!res.credential) return;
    const responseObj = jwtDecode<{
      email: string;
      name: string;
      picture: string;
    }>(res.credential);

    login(responseObj.email, responseObj.name, responseObj.picture).then(
      (data) => {
        if (!data)
          handleSavingUserDetails({
            name: "",
            email: "",
            pic: "",
            token: null,
          });
        else handleSavingUserDetails(data);
      }
    );
  };

  return (
    <div className="w-full h-14 flex flex-col items-center z-[500] p-2">
      <div className="w-full flex items-center justify-between">
        <div className="sm:flex items-center hidden ">
          <span className="text-2xl">
            <Search className="text-gray-600" />
          </span>
          <span className="font-semibold text-2xl">Search</span>
        </div>
        <form className="w-[70%] relative" onSubmit={handleSearchSubmit}>
          <div className="flex">
            <input
              type="text"
              ref={(node) => {
                if (node && isFocusSearch) {
                  node.focus();
                }

                if (isFocusSearch) {
                  setIsFocusSearch(false);
                }
              }}
              placeholder="Search for a location"
              value={tempSearch}
              onChange={(e) => {
                setTempSearch(e.target.value);
                if (e.target.value === "") setIsDropdownVisible(true);
              }}
              className="p-2 w-full border border-gray-200 rounded-l-lg text-black"
              onFocus={() => setIsDropdownVisible(true)}
              onBlur={() => {
                if (!isMouseIn)
                  setTimeout(() => setIsDropdownVisible(false), 200);
              }}
            />
            <button
              type="submit"
              className="px-4 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition-colors">
              <Search />
            </button>
          </div>

          {isDropdownVisible && (
            <div
              className="absolute top-14 w-full bg-white rounded-xl overflow-y-auto max-h-[40vh] z-[600]"
              onMouseEnter={() => setIsMouseIn(true)}
              onMouseLeave={() => setIsMouseIn(false)}>
              {savedSearch.length > 0 && (
                <div>
                  <p className="text-xl font-semibold text-center py-4 border-b">
                    Saved Searches
                  </p>
                  <div className="divide-y divide-gray-200">
                    {savedSearch.map((searchItem) => (
                      <div
                        key={searchItem.address}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <span
                          className="text-2xl"
                          onClick={() =>
                            handleSelectSearch(searchItem.address)
                          }>
                          {getTypedAddress(searchItem.type)}
                        </span>
                        <div>
                          <p
                            className="font-semibold text-base"
                            onClick={() =>
                              handleSelectSearch(searchItem.address)
                            }>
                            {searchItem.address.split(",")[0]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchItem.address}
                          </p>
                        </div>
                        <span
                          className="text-center ml-auto"
                          onClick={(e) =>
                            handleFavoriteSearch(e, searchItem.address)
                          }>
                          <Star
                            className={`text-gray-600 ${
                              searchItem.favorite ? "text-yellow-400" : ""
                            }`}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {recentSearch.length > 0 && (
                <div>
                  <p className="text-xl font-semibold text-center py-4 border-b">
                    Recent Searches
                  </p>

                  {recentSearch.map((searchItem) => (
                    <div
                      key={searchItem}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                      <span className="text-2xl">
                        <Search className="text-gray-600" />
                      </span>
                      <div
                        onClick={() => handleSelectSearch(searchItem)}
                        className="cursor-pointer">
                        <p className="font-semibold text-base">
                          {searchItem.split(",")[0]}
                        </p>
                        <p className="text-sm text-gray-500">{searchItem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
        <div>
          {!userDetails.token ? (
            <GoogleLogin
              onSuccess={onSuccess}
              width={50}
              shape="circle"
              theme="outline"
            />
          ) : (
            <div
              className="w-full border border-black rounded-md flex items-center justify-center gap-3 px-3"
              onClick={() =>
                handleSavingUserDetails({
                  name: "",
                  email: "",
                  pic: "",
                  token: null,
                })
              }>
              <img
                src={userDetails.pic}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <p>{userDetails.name.split(" ")[0]} </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
