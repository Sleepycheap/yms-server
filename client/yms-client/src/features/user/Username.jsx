import { useSelector } from 'react-redux';

function Username() {
  const username = useSelector((state) => state.user.username);

  if (!username) return null;
  return (
    <div className="text-[10px] font-semibold inline md:text-base  text-stone-100 ">{username}</div>
  );
}

export default Username;
