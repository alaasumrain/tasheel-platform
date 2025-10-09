import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Link from 'next/link';

import TasheelButton from './TasheelButton';

const NextLinkAdapter = forwardRef(function NextLinkAdapter({ href, prefetch, replace, scroll, shallow, ...props }, ref) {
  return (
    <Link
      ref={ref}
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      {...props}
    />
  );
});

export default function LinkButton({ href, prefetch = true, ...props }) {
  return <TasheelButton component={NextLinkAdapter} href={href} prefetch={prefetch} {...props} />;
}

LinkButton.propTypes = {
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  prefetch: PropTypes.bool
};
