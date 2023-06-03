import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setPageTitle } from 'features/common/headerSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="hero h-4/5 bg-base-200">
      <div className="hero-content">
        <div className="max-w-md">
          <Link to="/app/dashboard">
            <button className="btn bg-base-100 btn-outline">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
