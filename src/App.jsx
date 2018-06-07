import classNames from 'classnames';
import Steps from 'rc-steps';
import React, { Component } from 'react';

import data from './data.json';

import './App.css';

import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import logo from './logo.svg';

const meals = [
  { id: 'meal1', label: 'Breakfast', value: 'breakfast' },
  { id: 'meal2', label: 'Lunch', value: 'lunch' },
  { id: 'meal3', label: 'Dinner', value: 'dinner' }
];

const people = [
  { id: 'people1', label: '1' },
  { id: 'people2', label: '2' },
  { id: 'people3', label: '3' },
  { id: 'people4', label: '4' },
  { id: 'people5', label: '5' },
  { id: 'people6', label: '6' },
  { id: 'people7', label: '7' },
  { id: 'people8', label: '8+' }
];

const quantities = [
  { id: 'quantity0', label: '0' },
  { id: 'quantity1', label: '1' },
  { id: 'quantity2', label: '2' },
  { id: 'quantity3', label: '3' },
  { id: 'quantity4', label: '4' },
  { id: 'quantity5', label: '5' },
  { id: 'quantity6', label: '6' },
  { id: 'quantity7', label: '7' },
  { id: 'quantity8', label: '8' },
  { id: 'quantity9', label: '9' },
  { id: 'quantity10', label: '10' }
];

const steps = [
  { title: 'Step One' },
  { title: 'Step Two' },
  { title: 'Step Three' },
  { title: 'Review' }
];

const defaultDish = { id: 0, label: '---' };
const defaultMeal = 'meal3';
const defaultPeople = 'people2';
const defaultQuantity = 'quantity1';
const defaultRestaurant = '---';
const defaultStep = 0;

const defaultOrderItem = { dishId: '', quantity: defaultQuantity };

function getLabelById(array, id) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].id === id) {
      return array[i].label;
    }
  }
}

function getById(array, id) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].id.toString() === id) {
      return array[i];
    }
  }
  return {};
}

function getValueById(array, id) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].id === id) {
      return array[i].value;
    }
  }
}

function getRestaurantsByMeal(dishes, mealId) {
  const meal = getValueById(meals, mealId);
  const restaurants = [ defaultRestaurant ];

  dishes.forEach(({ availableMeals, restaurant }) => {
    if (availableMeals.indexOf(meal) !== -1 && restaurants.indexOf(restaurant) === -1) {
      restaurants.push(restaurant);
    }
  });

  return restaurants.map((restaurant) => { return { id: restaurant, label: restaurant }; });
}

function getDishesByRestaurantAndMeal(dishes, mealId, restaurantId) {
  const meal = getValueById(meals, mealId);
  const out = [ defaultDish ];

  dishes.forEach(({ availableMeals, id, name, restaurant }) => {
    if (availableMeals.indexOf(meal) !== -1 && restaurant === restaurantId) {
      out.push({ id, label: name });
    }
  });

  return out;
}

function selectOnChange(action) {
  return (event) => {
    action(event.target.value);
  }
}

function newOrderItem() {
  return Object.assign({}, defaultOrderItem);
}

class StepOne extends Component {
  render() {
    const { currentStep, mealId, peopleId, setMeal, setPeople, stepForward } = this.props;

    return (
      <div className={classNames({ hidden: currentStep !== 0 }, 'step-one')}>
        <p>Which meal would you like to eat?</p>
        <select value={mealId} onChange={selectOnChange(setMeal)}>
          {meals.map(({ id, label }, key) => {
            return (
              <option key={key} value={id}>{label}</option>
            );
          })}
        </select>
        <p>How many people?</p>
        <select value={peopleId} onChange={selectOnChange(setPeople)}>
          {people.map(({ id, label }, key) => {
            return (
              <option key={key} value={id}>{label}</option>
            );
          })}
        </select>
        <button onClick={stepForward}>Next</button>
      </div>
    );
  }
}

class StepTwo extends Component {
  render() {
    const { currentStep, mealId, restaurantId, setRestaurant, stepBackward, stepForward } = this.props;
    const hasDishes = getDishesByRestaurantAndMeal(data.dishes, mealId, restaurantId).length > 1;

    return (
      <div className={classNames({ hidden: currentStep !== 1 }, 'step-two')}>
        <p>Which restaurant?</p>
        <select value={restaurantId} onChange={selectOnChange(setRestaurant)}>
          {getRestaurantsByMeal(data.dishes, mealId).map(({ id, label }, key) => {
            return (
              <option key={key} value={id}>{label}</option>
            );
          })}
        </select>
        <button onClick={stepBackward}>Previous</button>
        <button disabled={!hasDishes} onClick={stepForward}>Next</button>
      </div>
    );
  }
}

class StepThree extends Component {
  render() {
    const { addOrderItem, currentStep, mealId, orderItems, restaurantId, stepBackward, stepForward, updateOrderItem } = this.props;

    return (
      <div className={classNames({ hidden: currentStep !== 2 }, 'step-three')}>
        <p>Menu</p>
        <p>Quantity</p>
        {orderItems.map(({ dishId, quantity }, key) => {
          const updateDishId = (dishId) => { updateOrderItem({ dishId, index: key, quantity })};
          const updateQuantity = (quantity) => { updateOrderItem({ dishId, index: key, quantity })};

          return (
            <div className='order-item' key={key}>
              <select value={dishId} onChange={selectOnChange(updateDishId)}>
                {getDishesByRestaurantAndMeal(data.dishes, mealId, restaurantId).map(({ id, label }, key) => {
                  return (
                    <option key={key} value={id}>{label}</option>
                  );
                })}
              </select>
              <select value={quantity} onChange={selectOnChange(updateQuantity)}>
                {quantities.map(({ id, label }, key) => {
                  return (
                    <option key={key} value={id}>{label}</option>
                  );
                })}
              </select>
            </div>
          );
        })}
        <button onClick={addOrderItem}>Add</button>
        <button onClick={stepBackward}>Previous</button>
        <button onClick={stepForward}>Next</button>
      </div>
    );
  }
}

class StepFour extends Component {
  render() {
    const { currentStep, mealId, orderItems, peopleId, restaurantId, stepBackward, stepForward } = this.props;

    return (
      <div className={classNames({ hidden: currentStep !== 3 }, 'step-four')}>
        <p>Meal: {getLabelById(meals, mealId)}</p>
        <p>People: {getLabelById(people, peopleId)}</p>
        <p>Restaurant: {restaurantId}</p>
        <p>Order: {orderItems.map(({dishId, quantity }, key) => {
          return (
            <span key={key}>{getById(data.dishes, dishId).name} {getLabelById(quantities, quantity)}</span>
          );
        })}</p>
        <button onClick={stepBackward}>Previous</button>
        <button onClick={stepForward}>Submit</button>
      </div>
    );
  }
}

class StepComplete extends Component {
  render() {
    const { currentStep } = this.props;

    return (
      <div className={classNames({ hidden: currentStep !== 4}, 'step-complete')}>
        <h1>Thank you!</h1>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      mealId: defaultMeal,
      orderItems: [ newOrderItem() ],
      peopleId: defaultPeople,
      restaurantId: defaultRestaurant,
      currentStep: defaultStep
    };

    this.addOrderItem = this.addOrderItem.bind(this);
    this.setMeal = this.setMeal.bind(this);
    this.setPeople = this.setPeople.bind(this);
    this.setRestaurant = this.setRestaurant.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.stepForward = this.stepForward.bind(this);
    this.updateOrderItem = this.updateOrderItem.bind(this);
  }

  addOrderItem() {
    const orderItems = this.state.orderItems.concat();
    orderItems.push(newOrderItem());

    this.setState({ orderItems });
  }

  resetOrderItems() {
    const orderItems = [newOrderItem()]

    this.setState({ orderItems });
  }

  setMeal(mealId) {
    this.setState({ mealId });
  }

  setPeople(peopleId) {
    this.setState({ peopleId });
  }

  setRestaurant(restaurantId) {
    if (restaurantId !== this.state.restaurantId) {
      this.resetOrderItems();
    }

    this.setState({ restaurantId });
  }

  stepBackward() {
    this.setState({ currentStep: Math.max(0, this.state.currentStep - 1) });
  }

  stepForward() {
    this.setState({ currentStep: Math.min(steps.length, this.state.currentStep + 1) });
  }

  updateOrderItem({ dishId, index, quantity }) {
    const { orderItems } = this.state;
    Object.assign(orderItems[index], { dishId, quantity });

    this.setState({ orderItems });
  }

  render() {
    const { currentStep, mealId, orderItems, peopleId, restaurantId } = this.state;
    const { addOrderItem, setMeal, setPeople, setRestaurant, stepBackward, stepForward, updateOrderItem } = this;

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Let's order food!</h1>
        </header>
        <div className='App-container'>
          <Steps className={classNames({ hidden: currentStep === steps.length })} current={currentStep}>
            {steps.map(({ title }, key) => {
              return (
                <Steps.Step key={key} title={title} />
              );
            })}
          </Steps>

          <StepOne
            currentStep={currentStep}
            mealId={mealId}
            peopleId={peopleId}
            setMeal={setMeal}
            setPeople={setPeople}
            stepForward={stepForward} />

          <StepTwo
            currentStep={currentStep}
            mealId={mealId}
            restaurantId={restaurantId}
            setRestaurant={setRestaurant}
            stepBackward={stepBackward}
            stepForward={stepForward} />

          <StepThree
            currentStep={currentStep}
            addOrderItem={addOrderItem}
            mealId={mealId}
            orderItems={orderItems}
            restaurantId={restaurantId}
            stepBackward={stepBackward}
            stepForward={stepForward}
            updateOrderItem={updateOrderItem} />

          <StepFour
            currentStep={currentStep}
            mealId={mealId}
            orderItems={orderItems}
            peopleId={peopleId}
            restaurantId={restaurantId}
            stepBackward={stepBackward}
            stepForward={stepForward} />

          <StepComplete
            currentStep={currentStep} />

        </div>
      </div>
    );
  }
}

export default App;
