import { EmployeeFormModal } from '../../components/EmployeeFormModal/EmployeeFormModal';
import { EmployeeTable } from '../../components/EmployeeTable/EmployeeTable';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { Header } from '../../components/Header/Header';
import { Alert } from '../../components/ui/Alert/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';
import { useEmployees } from '../../hooks/useEmployees';
import './DirectoryPage.css';

export const DirectoryPage = () => {
  const { user, logout } = useAuth();
  const {
    employees,
    search,
    department,
    isLoading,
    error,
    hasActiveFilters,
    setSearch,
    setDepartment,
    resetFilters,
    addEmployeeToList,
  } = useEmployees();

  const {
    isOpen,
    fullName,
    position,
    department: formDepartment,
    fieldErrors,
    serverError,
    isSubmitting,
    openModal,
    closeModal,
    setFullName,
    setPosition,
    setDepartment: setFormDepartment,
    handleSubmit,
  } = useEmployeeForm(addEmployeeToList);

  return (
    <div className="directory-page">
      <Header userEmail={user?.email ?? ''} onLogout={logout} />

      <main className="directory-page__content">
        <FilterBar
          search={search}
          department={department}
          totalCount={employees.length}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onDepartmentChange={setDepartment}
          onResetFilters={resetFilters}
          onOpenCreateModal={openModal}
        />

        {error && <Alert variant="error" message={error} />}

        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />
      </main>

      <EmployeeFormModal
        isOpen={isOpen}
        fullName={fullName}
        position={position}
        department={formDepartment}
        fieldErrors={fieldErrors}
        serverError={serverError}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onFullNameChange={setFullName}
        onPositionChange={setPosition}
        onDepartmentChange={setFormDepartment}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
