import React, {useEffect, useState} from "react";
import Loader from "../Loader";

const ClientAddCar = ({databaseApi, Swal}) => {

    const [car, setCar] = useState(null);
    const [brand, setBrand] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [year, setYear] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    const api = "https://private-anon-0957ac1d28-carsapi1.apiary-mock.com/cars";

    useEffect(() => {
        let mounted = true;
        fetch(api)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("Couldn't get car data")
            })
            .then(data => {
                if (mounted) {
                    setCar(data)
                    data.map(el => {
                        return setBrand(prev => [...prev, el.make])
                    })
                }
            })
            .catch((err) => console.log(err))

        const years = [];
        for (let i = 2022; i >= 1950; i--) {
            years.push(i);
        }
        setYear(years);

        return () => {
            mounted = false;
        }

    }, [])

    const allBrands = [];
    const deleteDuplicateBrands = () => {
        for (let i = 0; i <= brand.length; i++) {
            if (brand[i] !== brand[i + 1]) {
                allBrands.push(brand[i]);
            }
        }
    }
    deleteDuplicateBrands();

    const carData = {
        brand: selectedBrand,
        model: selectedModel,
        yearOfProduction: selectedYear
    }

    const addCar = () => {
        fetch(`${databaseApi}/clientCars`, {
            method: "POST",
            body: JSON.stringify(carData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("Couldn't get car data")
            })
            .catch((err) => console.log(err))
        Swal.fire({
            icon: "success",
            title: "Added successfully",
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: "green",
            backdrop: `rgba(0, 0, 0, 0.8)`,
        })
    }

    return (
        <section className="main-add-car">
            <h2 className="main-add-car__title">Fill Car Information</h2>
            {car ? <form className="form">
                <label>Brand:
                    <select onChange={e => {
                        setSelectedBrand(e.target.value)
                    }}>
                        <option disabled>...</option>
                        {brand ? allBrands.map((el, id) => {
                            return (
                                <option key={id}>{el}</option>
                            )
                        }) : null}
                    </select>
                </label>
                <label>Model:
                    <select onChange={e => {
                        setSelectedModel(e.target.value)
                    }}>
                        <option disabled>...</option>
                        {car ? car.map((el, id) => {
                            if (el.make === selectedBrand) {
                                return (
                                    <option key={id}>{el.model}</option>
                                )
                            }
                            return null;
                        }) : null}
                    </select>
                </label>
                <label>Year:
                    <select onChange={e => {
                        setSelectedYear(e.target.value)
                    }}>
                        <option disabled>...</option>
                        {year ? year.map((el, id) => {
                            return <option key={id}>{el}</option>
                        }) : null}
                    </select>
                </label>
                {selectedBrand && selectedModel && selectedYear ?
                    <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        addCar();
                    }}>Add car</button>
                    : <button style={{opacity: 0.6, cursor: "not-allowed"}} onClick={e => {
                        e.preventDefault()
                    }}>Add car</button>
                }
            </form> : <Loader/>}
        </section>
    )
}

export default ClientAddCar;