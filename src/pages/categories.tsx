import { useState, useEffect } from 'react';
import axios from 'axios';
import { Category, Pagination, Result } from '../Interface/categoriesInterface';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6; // Adjust the number of categories displayed per page
  const router = useRouter();
  const isTokenValid = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime && decodedToken.isVerified;
    } catch (error) {
      console.error('Token decoding failed', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchCategoriesAndUserSelection = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isTokenValid(token)) {
        router.push('/login');
        return;
      }
      try {
        const token = localStorage.getItem('token');

        const categoriesResponse = await axios.get<Result>(
          `/api/trpc/getCategories?page=${currentPage}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (categoriesResponse.data.result.data.success) {
          setCategories(categoriesResponse.data.result.data.categories);
          setPagination(categoriesResponse.data.result.data.pagination);
        } else {
          console.error(categoriesResponse.data.result.data.message);
        }

        const userCategoriesResponse = await axios.get<{ result: { data: { categories: { id: number }[] } } }>(
          `/api/trpc/getUserCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userCategoriesResponse.data.result.data.categories.length > 0) {
          setSelectedCategories(userCategoriesResponse.data.result.data.categories.map((category) => category.id));
        } else {
          setSelectedCategories([]);
        }

      } catch (error) {
        console.error('Failed to fetch categories or user selection', error);
      }
    };

    fetchCategoriesAndUserSelection();
  }, [currentPage]);

  const handleCheckboxChange = async (id: number) => {
    const updatedSelection = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];

    setSelectedCategories(updatedSelection);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/trpc/updateSelectedCategories',
        { categoryIds: updatedSelection },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to update selected categories', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageButtons: JSX.Element[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`px-4 py-2 border rounded-lg transition-all ${
              i === currentPage
                ? 'bg-blue-500 text-white font-bold border-blue-500'
                : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageButtons.push(
          <button
            key={1}
            className={`px-4 py-2 border rounded-lg transition-all ${
              1 === currentPage
                ? 'bg-blue-500 text-white font-bold border-blue-500'
                : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(1)}
            disabled={1 === currentPage}
          >
            1
          </button>
        );

        if (startPage > 2) {
          pageButtons.push(
            <span key="ellipsis-start" className="px-4 py-2 border rounded-lg text-gray-600">
              ...
            </span>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`px-4 py-2 border rounded-lg transition-all ${
              i === currentPage
                ? 'bg-blue-500 text-white font-bold border-blue-500'
                : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageButtons.push(
            <span key="ellipsis-end" className="px-4 py-2 border rounded-lg text-gray-600">
              ...
            </span>
          );
        }

        pageButtons.push(
          <button
            key={totalPages}
            className={`px-4 py-2 border rounded-lg transition-all ${
              totalPages === currentPage
                ? 'bg-blue-500 text-white font-bold border-blue-500'
                : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(totalPages)}
            disabled={totalPages === currentPage}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };

  const handleLogout = () => {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 mt-10 border-white-500 rounded-lg w-2/4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Please mark your interests!</h1>
      <p className="text-gray-600 mb-6">We will keep you notified.</p>
      <h2 className="text-lg font-semibold mb-4">My saved interests!</h2>

      <form className="w-full space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-black"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCheckboxChange(category.id)}
            />
            <span className="text-md">{category.name}</span>
          </div>
        ))}
      </form>

      <div className="mt-6 flex justify-center space-x-2">
        {renderPaginationButtons()}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        LOGOUT
      </button>
    </div>
  );
};

export default CategoriesPage;
