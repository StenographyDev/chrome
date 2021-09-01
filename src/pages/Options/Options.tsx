import React, { useState } from 'react';
import './Options.css';
import Fuse from 'fuse.js'

interface Props {
  title: string;
}

const books = [
  {
    "title": "Old Man's War",
    "author": {
      "firstName": "John",
      "lastName": "Scalzi"
    }
  },
  {
    "title": "The Lock Artist",
    "author": {
      "firstName": "Steve",
      "lastName": "Hamilton"
    }
  },
  {
    "title": "HTML5",
    "author": {
      "firstName": "Remy",
      "lastName": "Sharp"
    }
  },
  {
    "title": "Right Ho Jeeves",
    "author": {
      "firstName": "P.D",
      "lastName": "Woodhouse"
    }
  },
  {
    "title": "The Code of the Wooster",
    "author": {
      "firstName": "P.D",
      "lastName": "Woodhouse"
    }
  },
  {
    "title": "Thank You Jeeves",
    "author": {
      "firstName": "P.D",
      "lastName": "Woodhouse"
    }
  },
  {
    "title": "The DaVinci Code",
    "author": {
      "firstName": "Dan",
      "lastName": "Brown"
    }
  },
  {
    "title": "Angels & Demons",
    "author": {
      "firstName": "Dan",
      "lastName": "Brown"
    }
  },
  {
    "title": "The Silmarillion",
    "author": {
      "firstName": "J.R.R",
      "lastName": "Tolkien"
    }
  },
  {
    "title": "Syrup",
    "author": {
      "firstName": "Max",
      "lastName": "Barry"
    }
  },
  {
    "title": "The Lost Symbol",
    "author": {
      "firstName": "Dan",
      "lastName": "Brown"
    }
  },
  {
    "title": "The Book of Lies",
    "author": {
      "firstName": "Brad",
      "lastName": "Meltzer"
    }
  },
  {
    "title": "Lamb",
    "author": {
      "firstName": "Christopher",
      "lastName": "Moore"
    }
  },
  {
    "title": "Fool",
    "author": {
      "firstName": "Christopher",
      "lastName": "Moore"
    }
  },
  {
    "title": "Incompetence",
    "author": {
      "firstName": "Rob",
      "lastName": "Grant"
    }
  },
  {
    "title": "Fat",
    "author": {
      "firstName": "Rob",
      "lastName": "Grant"
    }
  },
  {
    "title": "Colony",
    "author": {
      "firstName": "Rob",
      "lastName": "Grant"
    }
  },
  {
    "title": "Backwards, Red Dwarf",
    "author": {
      "firstName": "Rob",
      "lastName": "Grant"
    }
  },
  {
    "title": "The Grand Design",
    "author": {
      "firstName": "Stephen",
      "lastName": "Hawking"
    }
  },
  {
    "title": "The Book of Samson",
    "author": {
      "firstName": "David",
      "lastName": "Maine"
    }
  },
  {
    "title": "The Preservationist",
    "author": {
      "firstName": "David",
      "lastName": "Maine"
    }
  },
  {
    "title": "Fallen",
    "author": {
      "firstName": "David",
      "lastName": "Maine"
    }
  },
  {
    "title": "Monster 1959",
    "author": {
      "firstName": "David",
      "lastName": "Maine"
    }
  }
]

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: [
    "title",
    "author.firstName"
  ]
};

const fuse = new Fuse(books, options);
console.log(fuse.search('old min'))

const searchFuse = (searchTerm: string) => {
  return fuse.search(searchTerm)
}

interface Book { title: string; author: { firstName: string; lastName: string; } }

const Options: React.FC<Props> = ({ title }: Props) => {
  const [searchTerm, setSearchTerm] = useState(JSON.stringify([{
    title: '',
    author: {
      firstName: '',
      lastName: ''
    }
  }]));
  return <div className="OptionsContainer">{title.toUpperCase()} PAGE
    <input type="text" placeholder="Search" onChange={evt => setSearchTerm(JSON.stringify(searchFuse(evt.target.value)))} />
    <p>{searchTerm}</p>
  </div>;
};

export default Options;
