export const fetchSavedSearch = async (token: string) => {
  try {
    const res = await fetch("https://location-spot-app-backend.vercel.app/address", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    return [];
  }
};

export const favoriteSearch = async (address: string, token: string) => {
  try {
    const res = await fetch("https://location-spot-app-backend.vercel.app/address/fav", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address, userId: "123" }),
    });

    const data = await res.json();
    if (data.success) {
      return true;
    }
  } catch (error) {
    console.error("Error updating favorite status:", error);
    return false;
  }
};

export const login = async (email: string, name: string, pic: string) => {
  try {
    const response = await fetch("https://location-spot-app-backend.vercel.app/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, pic }),
    });

    const data = await response.json();
    if (data.success) {
      return {
        email,
        name,
        pic,
        token: data.token,
      };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const saveLocation = async (
  formData: {
      addressFetched: string;
      houseAddress: string;
      aparmentAddress: string;
  },
  token: string,
  type: string
) => {
  try {
    const res = await fetch("https://location-spot-app-backend.vercel.app/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        userId: "123",
        type,
      }),
    });

    const data = await res.json();
    if (data.success) {
        return true;
    }
  } catch (e) {
    console.error("Error saving location:", e);
    return false;
  }
};
