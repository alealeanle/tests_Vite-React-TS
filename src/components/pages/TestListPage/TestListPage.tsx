import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { ExistingTest } from 'src/types/testsTypes';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { fetchTestsRequest, deleteTestRequest } from '@models/testsSlice';
import Modal from '@commons/Modal';
import Header from '@commons/Header';
import Footer from '@commons/Footer';
import Loading from '@commons/Loading';
import s from './TestListPage.module.scss';

const highlightMatch = (text: string, filter: string) => {
  if (!filter) return text;

  const regex = new RegExp(`(${filter})`, 'gi');
  const parts = text.split(regex);
  const lowerFilter = filter.toLowerCase();

  return parts.map(part => (
    <span
      key={uuidv4()}
      className={clsx({ [s.highlight]: part.toLowerCase() === lowerFilter })}
    >
      {part}
    </span>
  ));
};

const TestListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tests, meta, loading, error } = useAppSelector(state => state.tests);
  const { isAdmin } = useAppSelector(state => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterText, setFilterText] = useState<string>(
    searchParams.get('search') || '',
  );
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get('sort') || 'created_at_desc',
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<ExistingTest | null>(null);
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1,
  );

  useEffect(() => {
    dispatch(
      fetchTestsRequest({
        page,
        per: 5,
        search: filterText,
        sort: sortOrder,
      }),
    );
  }, [dispatch, page, filterText, sortOrder]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilterText(value);
    setSearchParams({ search: value, sort: sortOrder, page: '1' });
    setPage(1);
  };

  const handleSortChange = () => {
    const newSortOrder =
      sortOrder === 'created_at_desc' ? 'created_at_asc' : 'created_at_desc';
    setSortOrder(newSortOrder);
    setSearchParams({
      search: filterText,
      sort: newSortOrder,
      page: String(page),
    });
    dispatch(
      fetchTestsRequest({
        page,
        per: 5,
        search: filterText,
        sort: sortOrder,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({
      search: filterText,
      sort: sortOrder,
      page: String(newPage),
    });
  };

  const handleTestClick = () => {
    if (!selectedTest) return;
    navigate(`/passing_test/${selectedTest.id}`);
    closeModal();
  };

  const handleCreateTest = () => {
    navigate('/create_test/');
  };

  const handleEditTest = (testId: number) => {
    navigate(`/edit_test/${testId}`);
  };

  const handleDeleteTest = () => {
    if (!selectedTest) return;
    setPage(1);
    setSearchParams({ search: filterText, sort: sortOrder, page: '1' });
    dispatch(
      deleteTestRequest({
        testId: selectedTest.id,
        params: {
          page: 1,
          per: 5,
          search: filterText,
          sort: sortOrder,
        },
      }),
    );
    closeModal();
  };

  const openModal = (type: string, test: ExistingTest) => {
    setSelectedTest(test);
    setModalContent(type);
    setShowModal(true);
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      setModalContent(null);
      setSelectedTest(null);
    }, 300);
  }, []);

  const renderPagination = () => {
    const totalPages = (meta && meta.total_pages) || 1;
    if (totalPages <= 1) return null;

    const pagination = [];
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, page + 1);

    if (startPage > 1) {
      pagination.push(
        <button
          className={s.paginationBtn}
          key={1}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pagination.push(<span key="leftDots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <button
          key={i}
          className={clsx({
            [s.paginationBtn]: i !== page,
            [s.activePage]: i === page,
          })}
          onClick={() => i !== page && handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pagination.push(<span key="rightDots">...</span>);
      }
      pagination.push(
        <button
          className={s.paginationBtn}
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className={s.pagination}>{pagination}</div>;
  };

  return (
    <div className={clsx(s.root, s._container)}>
      <Header />
      <div className={s.testListBody}>
        <div className={clsx(s.firstRow, { [s.firstRowForUser]: !isAdmin })}>
          {isAdmin && (
            <button
              className={clsx(s.btn, s.createTest)}
              onClick={handleCreateTest}
            >
              Создать
            </button>
          )}
          <input
            type="text"
            placeholder="Поиск"
            value={filterText}
            autoFocus
            onChange={handleFilterChange}
            className={clsx(s.filterInput, {
              [s.filterInputForUser]: !isAdmin,
            })}
          />
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className={s.error} style={{ color: 'red' }}>
            Ошибка: {error}
          </div>
        ) : !tests || tests.length === 0 ? (
          filterText ? (
            <div className={s.emptyList}>
              По введенному поисковому запросу ничего не найдено
            </div>
          ) : (
            <div className={s.emptyList}>Список пуст</div>
          )
        ) : (
          <>
            <div className={s.sort} onClick={handleSortChange}>
              Сортировать по дате
              {sortOrder === 'created_at_desc' ? (
                <span className={s.sortArrow}>{'\u00A0'}(↓)</span>
              ) : (
                <span className={s.sortArrow}>{'\u00A0'}(↑)</span>
              )}
            </div>
            <ul className={s.testsList}>
              {tests.map((test: ExistingTest) => (
                <li key={test.id} className={s.testItem}>
                  {isAdmin && (
                    <>
                      <div className={s.itemButtons}>
                        <button
                          className={clsx(s.itemBtn, 'icon-edit')}
                          onClick={() => handleEditTest(test.id)}
                        ></button>
                        <button
                          className={clsx(s.itemBtn, 'icon-delete')}
                          onClick={() => openModal('delete', test)}
                        ></button>
                      </div>
                    </>
                  )}
                  <div
                    className={s.testTitle}
                    onClick={() => openModal('start', test)}
                  >
                    {highlightMatch(test.title, filterText)}
                  </div>
                </li>
              ))}
              <Modal
                title="Подтверждение действия"
                isOpen={showModal}
                setIsModalOpen={setShowModal}
                onCloseCallback={closeModal}
              >
                <div className={s.modalText}>
                  {modalContent === 'delete'
                    ? 'Удалить тест "'
                    : 'Начать прохождение теста "'}
                  {selectedTest?.title}" ?
                </div>
                <div className={s.modalBtnsWrap}>
                  <button
                    type="button"
                    className={clsx(s.btn, s.modalDeleteBtn)}
                    onClick={
                      modalContent === 'delete'
                        ? handleDeleteTest
                        : handleTestClick
                    }
                  >
                    {modalContent === 'delete' ? 'Удалить' : 'Подтвердить'}
                  </button>
                  <button type="button" className={s.btn} onClick={closeModal}>
                    Отмена
                  </button>
                </div>
              </Modal>
            </ul>
            {renderPagination()}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TestListPage;
