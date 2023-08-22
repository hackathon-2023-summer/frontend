import { createContext, useState, useContext, ReactNode, SetStateAction, Dispatch } from 'react';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  userId: null | number; // userIdの型も適切に指定する必要があります。
  setUserId: Dispatch<SetStateAction<null | number>>;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: (value: SetStateAction<null | number>) => { }, // 型に一致するシグネチャ
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<null | number>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
