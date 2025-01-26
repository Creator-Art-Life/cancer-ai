import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { db } from "../utils/dbConfig"; // Adjust the path to your dbConfig
import {
  Users as UsersSchema,
  Records as RecordsSchema,
} from "../utils/schema"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";

// Типы для пользователя и записи
export type User = {
  id: number;
  username: string;
  age: number;
  location: string;
  folders: string[];
  treatmentCounts: number;
  folder: string[];
  createdBy: string;
};

export type Record = {
  id: number;
  userId: number;
  recordName: string;
  analysisResult: string;
  kanbanRecords: string;
  createdBy: string;
  // documentID?: string;
};

// Создание контекста с типами
interface StateContextType {
  users: User[];
  records: Record[];
  currentUser: User | null;
  fetchUsers: () => Promise<void>;
  fetchUserByEmail: (email: string) => Promise<void>;
  createUser: (userData: Omit<User, "id">) => Promise<User | null>;
  fetchUserRecords: (userEmail: string) => Promise<void>;
  createRecord: (recordData: Omit<Record, "id">) => Promise<Record | null>;
  updateRecord: (recordData: Record) => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Провайдер контекста
export const StateContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Функция для получения всех пользователей
  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(UsersSchema).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Функция для получения пользователя по email
  const fetchUserByEmail = useCallback(async (email: string) => {
    try {
      const result = await db
        .select()
        .from(UsersSchema)
        .where(eq(UsersSchema.createdBy, email))
        .execute();
      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  }, []);

  // Функция для создания нового пользователя
  const createUser = useCallback(async (userData: Omit<User, "id">) => {
    try {
      const newUser = await db
        .insert(UsersSchema)
        .values(userData)
        .returning({ id: UsersSchema.id, createdBy: UsersSchema.createdBy })
        .execute();

      // Формируем полный объект пользователя
      const fullUser = {
        ...userData,
        id: newUser[0].id,
        createdBy: newUser[0].createdBy,
      };

      setUsers((prevUsers) => [...prevUsers, fullUser]);
      return fullUser;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  // Функция для получения всех записей пользователя
  const fetchUserRecords = useCallback(async (userEmail: string) => {
    try {
      const result = await db
        .select()
        .from(RecordsSchema)
        .where(eq(RecordsSchema.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
    }
  }, []);

  // Функция для создания новой записи
  const createRecord = useCallback(async (recordData: Omit<Record, "id">) => {
    try {
      const newRecord = await db
        .insert(RecordsSchema)
        .values(recordData)
        .returning({ id: RecordsSchema.id })
        .execute();

      // Формируем полный объект записи
      const fullRecord = {
        ...recordData,
        id: newRecord[0].id,
      };

      setRecords((prevRecords) => [...prevRecords, fullRecord]);
      return fullRecord;
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  // Функция для обновления записи
  const updateRecord = useCallback(async (recordData: Record) => {
    try {
      const { id, ...dataToUpdate } = recordData;
      await db
        .update(RecordsSchema)
        .set(dataToUpdate)
        .where(eq(RecordsSchema.id, id))
        .returning();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Кастомный хук для использования контекста
export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};
