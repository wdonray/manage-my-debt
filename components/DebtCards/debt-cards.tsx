import { IDebt } from '@/types';
import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react';
import { DebtContext, SearchEnum } from '@/util';
import { UpdateDebtModal } from './components';
import { DebtCard } from './components';
import { orderBy } from 'lodash';
import FilterDebt from './components/filter-debt';

export enum SortDebt {
  none = 'none',
  balance = 'balance',
  apr = 'apr',
  payment = 'payment',
}

export enum SortDirection {
  none = 'none',
  asc = 'asc',
  desc = 'desc',
}

export enum SearchType {
  name = 'name',
  type = 'type',
}

export default function DebtCards() {
  const { debtList, localDebtList, isUserAuthenticated } = useContext(DebtContext);

  const [searchByValue, setSearchByValue] = useState('');
  const [searchByType, setSearchByType] = useState<SearchType>(SearchType.name);
  const [currentDirection, setCurrentDirection] = useState<SortDirection>(SortDirection.none);
  const [currentSort, setCurrentSortDebt] = useState<SortDebt>(SortDebt.none);

  const [loading, setLoading] = useState(false);

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

  const handleSortSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setCurrentSortDebt(SearchEnum(SortDebt, value) as SortDebt);
  }, []);

  const handleSortDirection = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setCurrentDirection(currentDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc);
  }, [currentDirection]);

  const currentDebtList = useMemo(() => {
    setLoading(true);

    let list = isUserAuthenticated ? debtList : localDebtList;

    if (searchByValue != '') {
      list = list?.filter((item) => item[searchByType].toLocaleLowerCase().includes(searchByValue.toLocaleLowerCase()));
    }

    if (currentDirection != SortDirection.none) {
      list = orderBy(list, [currentSort], [currentDirection]);
    }

    setLoading(false);

    return list;
  }, [currentDirection, currentSort, debtList, isUserAuthenticated, localDebtList, searchByType, searchByValue]);

  const isListEmpty = useMemo(() => !currentDebtList || !currentDebtList.length, [currentDebtList]);

  const direction = useMemo(() => currentDirection === SortDirection.asc ? 'ascending' : 'descending', [currentDirection]);

  useEffect(() => {
    if (currentSort != SortDebt.none && currentDirection == SortDirection.none) {
      setCurrentDirection(SortDirection.asc);
    } else if (currentSort == SortDebt.none) {
      setCurrentDirection(SortDirection.none);
    }
  }, [currentDirection, currentSort]);

  if (loading) {
    return (
      <div className='d-flex justify-content-center'>
        <div className='spinner-border text-info m-5 p-3' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UpdateDebtModal />
      <FilterDebt
        searchByType={searchByType}
        searchByValue={searchByValue}
        currentSort={currentSort}
        currentDirection={currentDirection}
        handleSearchType={handleSearchType}
        handleSearchValue={handleSearchValue}
        handleSortSelect={handleSortSelect}
        handleSortDirection={handleSortDirection}
      />
      {
        currentSort != SortDebt.none && (
          <div className='d-flex justify-content-end pt-3'>
            <span>
              Sorted by {direction} <strong>{currentSort}</strong>
            </span>
          </div>
        )
      }
      {
        isListEmpty ?
          (
            <div className='d-flex flex-column justify-content-center align-items-center text-center mt-5'>
              <i className='bi bi-exclamation-diamond fs-1'></i>
              <h1>No results found</h1>
              <span>Please check spelling or try again with different search</span>
            </div>
          ) :
          (
            <div 
              id='debt-list' 
              className='row g-3 mb-4 pt-3'
            >
              {currentDebtList?.map((debt: IDebt) => (
                <div
                  className='col-12 col-md-6 col-lg-4 mr-0'
                  key={debt.id}
                >
                  <DebtCard debt={debt} />
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}