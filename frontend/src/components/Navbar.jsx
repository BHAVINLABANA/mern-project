function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        Vendor Dashboard
      </h1>

      <div className="font-medium">
        {user?.name}
      </div>
    </header>
  );
}

export default Navbar;