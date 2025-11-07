import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    tipe: null
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 9
  });

  const fetchEvents = async (filterParams = {}, page = 1, perPage = 9) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', perPage);
    
    if (filterParams.status && filterParams.status !== 'all') {
      params.append('status', filterParams.status);
    }
    if (filterParams.tipe && filterParams.tipe !== 'all') {
      params.append('tipe', filterParams.tipe);
    }

    const url = `${API_BASE_URL}/profile/dashboard?${params.toString()}`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    const data = response.data.data;
    setEvents(data.events);
    setPagination({
      currentPage: data.pagination.current_page || page,
      totalPages: data.pagination.last_page || 1,
      totalItems: data.pagination.total || 0,
      perPage: data.pagination.per_page || perPage
    });
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  } finally {
    setLoading(false);
  }
};

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents(filters, pagination.currentPage, pagination.perPage);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters, 1, pagination.perPage);
  };

  const updatePage = (page) => {
    fetchEvents(filters, page, pagination.perPage);
  };

  const updatePerPage = (perPage) => {
    fetchEvents(filters, 1, perPage);
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading, 
      filters,
      pagination,
      updateFilters,
      updatePage,
      updatePerPage,
      refetchEvents: () => fetchEvents(filters, pagination.currentPage, pagination.perPage)
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);