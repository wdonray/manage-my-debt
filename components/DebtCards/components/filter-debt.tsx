import { MouseEvent, ChangeEvent, useMemo } from 'react';
import { upperFirst } from 'lodash';
import { SortDebt, SortDirection, SearchType } from '../debt-cards';

interface FilterDebtProps {
  searchByType: SearchType,
  searchByValue: string,
  currentSort: SortDebt,
  currentDirection: SortDirection,
  handleSearchType: (event: MouseEvent<HTMLButtonElement>) => void,
  handleSearchValue: (event: ChangeEvent<HTMLInputElement>) => void,
  handleSortSelect: (event: ChangeEvent<HTMLSelectElement>) => void,
  handleSortDirection: (event: MouseEvent<HTMLButtonElement>) => void,
}

export default function FilterDebt({
  searchByType,
  searchByValue,
  currentSort,
  currentDirection,
  handleSearchType,
  handleSearchValue,
  handleSortSelect,
  handleSortDirection,
}: FilterDebtProps) {
  const sortDirectionIcon = useMemo(() => `bi bi-sort-numeric-${currentDirection === SortDirection.desc ? 'down' : 'up'}`, [currentDirection]);

  return (
    <div>
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
        className='collapse border rounded'
        id='filter-collapse'
      >
        <div className='row p-3'>
          <div className='col-12 col-md-4'>
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
                placeholder={'Type here to search...'}
                value={searchByValue}
              />
            </div>
          </div>
          <div className='col-9 col-md-3 mt-2 mt-md-0'>
            <label htmlFor='sort-select'>
              Sort By:
            </label>
            <select
              className='form-select'
              id='sort-select'
              onChange={handleSortSelect}
              value={currentSort}
            >
              <option value={SortDebt.none}>None</option>
              <option value={SortDebt.balance}>Balance</option>
              <option value={SortDebt.apr}>Interest Rate (APR)</option>
              <option value={SortDebt.payment}>Payment</option>
            </select>
          </div>
          <div className='col-3 d-flex align-items-end'>
            <button
              disabled={currentDirection === SortDirection.none}
              type='button'
              className='btn btn-outline-secondary'
              onClick={handleSortDirection}
            >
              <i className={sortDirectionIcon} />
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}