import { IDebt } from '@/types';
import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react';
import { DebtContext, SearchEnum } from '@/util';
import { UpdateDebtModal } from './components';
import { DebtCard } from './components';
import { orderBy, upperFirst } from 'lodash';

enum SortDebt {
  none = 'none',
  balance = 'balance',
  apr = 'apr',
  payment = 'payment',
}

enum SortDirection {
  none = 'none',
  asc = 'asc',
  desc = 'desc',
}

enum SearchType {
  name = 'name',
  type = 'type',
}

export default function DebtCards() {
  const { debtList, localDebtList, isUserAuthenticated } = useContext(DebtContext);

  const [searchByValue, setSearchByValue] = useState('');
  const [searchByType, setSearchByType] = useState<SearchType>(SearchType.name);
  const [currentDirection, setCurrentDirection] = useState<SortDirection>(SortDirection.none);
  const [currentSort, setCurrentSortDebt] = useState<SortDebt>(SortDebt.none);

  const handleSearchValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;

    setSearchByValue(value.trim());
  }, []);

  const handleSearchType = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;

    setSearchByType(SearchEnum(SearchType, name) as SearchType);
  }, []);

  const handleSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'SortDebt') {
      setCurrentSortDebt(SearchEnum(SortDebt, value) as SortDebt);
    } else {
      setCurrentDirection(SearchEnum(SortDirection, value) as SortDirection);
    }
  }, []);

  const currentDebtList = useMemo(() => {
    let list = isUserAuthenticated ? debtList : localDebtList;

    if (searchByValue != '') {
      list = list?.filter((item) => item[searchByType].includes(searchByValue));
    }

    if (currentDirection != SortDirection.none) {
      list = orderBy(list, [currentSort], [currentDirection]);
    }

    return list;
  }, [currentDirection, currentSort, debtList, isUserAuthenticated, localDebtList, searchByType, searchByValue]);

  const isListEmpty = useMemo(() => !currentDebtList || !currentDebtList.length, [currentDebtList]);

  useEffect(() => {
    if (currentSort != SortDebt.none && currentDirection == SortDirection.none) {
      setCurrentDirection(SortDirection.asc);
    } else if (currentSort == SortDebt.none) {
      setCurrentDirection(SortDirection.none);
    }
  }, [currentDirection, currentSort]);

  return (
    <div>
      <UpdateDebtModal />
      <div className='d-flex justify-content-end mb-3'>
        <button
          type='button'
          className='btn btn-light border btn-sm'
          data-bs-toggle='collapse'
          data-bs-target='#filter-collapse'
        >
          <i className='bi bi-filter'></i> Filters
        </button>
      </div>
      <div
        className='collapse border rounded mb-3'
        id='filter-collapse'
      >
        <div className='row p-3'>
          <div className='col-3'>
            <label htmlFor='debt-search'>
              Search By:
            </label>
            <div
              className='input-group'
              id='debt-search'
            >
              <button
                className='btn btn-outline-secondary dropdown-toggle'
                type='button'
                data-bs-toggle='dropdown'
              >
                {upperFirst(searchByType)}
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <button
                    name='name'
                    className='dropdown-item'
                    onClick={handleSearchType}
                  >
                    Name
                  </button>
                </li>
                <li>
                  <button
                    name='type'
                    className='dropdown-item'
                    onClick={handleSearchType}
                  >
                    Type
                  </button>
                </li>
              </ul>
              <input
                type='text'
                className='form-control'
                onChange={handleSearchValue}
              />
            </div>
          </div>
          <div className='col-3'>
            <label htmlFor='sort-select'>
              Sort By:
            </label>
            <select
              className='form-select'
              id='sort-select'
              name='SortDebt'
              onChange={handleSelect}
              value={currentSort}
            >
              <option value={SortDebt.none}>None</option>
              <option value={SortDebt.balance}>Balance</option>
              <option value={SortDebt.apr}>Interest Rate (APR)</option>
              <option value={SortDebt.payment}>Payment</option>
            </select>
          </div>
          <div className='col-3'>
            <label htmlFor='direction-select'>
              Sort Direction:
            </label>
            <select
              className='form-select'
              id='direction-select'
              name='SortDirection'
              onChange={handleSelect}
              value={currentDirection}
            >
              <option disabled={currentSort != SortDebt.none} value={SortDirection.none}>None</option>
              <option value={SortDirection.asc}>Ascending</option>
              <option value={SortDirection.desc}>Descending</option>
            </select>
          </div>
        </div>
      </div>
      {
        isListEmpty ?
          (
            <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
              <i className='bi bi-exclamation-diamond fs-1'></i>
              <h1>No results found</h1>
              <span>Please check spelling or try again with different search</span>
            </div>
          ) :
          (
            <div className='row g-3'>
              {currentDebtList?.map((debt: IDebt, index: number) => (
                <div className='col-4 mr-0' key={debt.id ?? index}>
                  <DebtCard debt={debt} />
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}