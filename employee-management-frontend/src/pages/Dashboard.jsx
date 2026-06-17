import Navbar from "../components/Navbar";

function Dashboard() {

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <h1>Dashboard</h1>

                <div className="row mt-4">

                    <div className="col-md-3">

                        <div className="card text-center shadow">

                            <div className="card-body">

                                <h3>12</h3>

                                <p>Total Employees</p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card text-center shadow">

                            <div className="card-body">

                                <h3>3</h3>

                                <p>Departments</p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card text-center shadow">

                            <div className="card-body">

                                <h3>5</h3>

                                <p>Designations</p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card text-center shadow">

                            <div className="card-body">

                                <h3>8</h3>

                                <p>Projects</p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}

export default Dashboard;