import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

type Status = 'DONE' | 'PENDING';

interface ToDoItem {
	title: string;
	status: Status;
}

const invertStatus = (item: ToDoItem): ToDoItem  => {
	return {
		title: item.title,
		status: item.status === 'DONE' ? 'PENDING' : 'DONE',
	}
}

function App() {
	const [pendingCount, setPendingCount] = useState(0);
	const [doneCount, setDoneCount] = useState(0);

	const [pendingItems, setPendingItems] = useState<ToDoItem[]>([]);
	const [doneItems, setDoneItems] = useState<ToDoItem[]>([]);

   	useEffect(() => {
		let headers: Readonly<Record<string, string>> = { 
			'token': 'some_token' 
		};
    	axios
			.get('http://localhost:8080/v1/item', headers)
         	.then((response) => {
				setPendingCount(response.data.pending_item_count);
				setDoneCount(response.data.done_item_count);
				setPendingItems(response.data.pending_items);
				setDoneItems(response.data.done_items);
			})
			.catch((err) => console.log(err.message));
   	}, []);

	const deleteItem = (item: ToDoItem) => {
		const options = {
			method: 'POST',
    		url: 'http://localhost:8080/v1/item/delete',
    		params: {  },
    		headers: {
				'token': 'some_token' 
    		},
    		data: item,
		};
		axios
			.post('http://localhost:8080/v1/item/delete', item)
			.then(res => {
				setPendingCount(res.data.pending_item_count);
				setDoneCount(res.data.done_item_count);
				setPendingItems(res.data.pending_items);
				setDoneItems(res.data.done_items);
				console.log(res)
			})
			.catch(err => console.error(err));
	};

	const invertStatus = (item: ToDoItem) => {
		const options = {
			method: 'POST',
    		url: 'http://localhost:8080/v1/item/edit',
    		params: {  },
    		headers: {
				'token': 'some_token' 
    		},
    		data: item,
		};
		console.log('edit endpoint');
		axios
			.request(options)
			.then(res => console.log(res))
			.catch(err => console.error(err));
	};

  return (
    <div className="App">
      <header className="App-header">
	  	<h1>To Do Items</h1>
	  	<h3>Pending Items: { pendingCount }</h3>
		{pendingItems.map((item, index) => (
			<div key={index}>
				<span>{item.title}</span>
				<button onClick={() => invertStatus(item)}>Set Done</button>
				<button onClick={() => deleteItem(item)}>Delete</button>
			</div>
		))}
	  	<h3>Done Items: { doneCount }</h3>
		{doneItems.map((item, index) => (
			<div key={index}>
				<span>{item.title}</span>
				<button onClick={() => invertStatus(item)}>Set Pending</button>
				<button onClick={() => deleteItem(item)}>Delete</button>
			</div>
		))}
      </header>
    </div>
  );
}

export default App;
