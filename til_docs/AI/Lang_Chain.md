# Overview

- Langchain integrates with various LLMs to allow you to easily integrate with a standard interface
- It also provides "chains" which are chained api calls that allow you to do more powerful things with LLMs

## Langchain Primitives

- LLM
  - The base building block of Langchain, takes a text input and gets a prediction text output
- Chat Models
  - A specialized version of LLMs that take in message objects instead of raw text
- Prompt templates
  - Most applications do not pass raw user input to LLMs. They inject the user input into a larger prompt template
  and send the whole combined message to the LLM
  - Langchain allows you to define custom prompt templates for applications you're building 
- Chains 
  - These are a way to link multiple primitives together (e.g. LLMs, Chat Models, Prompt Templates) to create a more powerful response
  - A simple example of this is chaining together a prompt template with an LLM 
- Agents
  - Chains follow a static path of structure. Agents can choose options dynamically
  - Each agent can complete a certain task (Google search, DB lookup, Python REPL)
- Memory
  - Allows chains/models to maintain state about previous messages, etc. 
- Documents
  - Structures of text that can be used as input to chains, etc.
  - A common workflow is to take a large chunk of text, split it up into a bunch of documents, and then feed those documents into a chain

## Embeddings

- The `Embeddings` class represents text as vectors
  - This allows you to interface with text embedding models (OpenAI, Cohere, Hugging Face, etc.)
- This allows you to think of text in a vector space and do vector search on it
- There are two types of embeddings in LangChain
  - Document embeddings (for content to be searched over)
  - Query embeddings (the query to search the documents)
- One of the most common ways to search over related data is to embed it and store the resulting embedding vectors 
  - At query time, embed the query and do a search for the most closely related vectors
- You can store these in vector databases

## Source Code Notes

- The `apply` method of a chain calls the chain multiple times according to the list of chain inputs
- The `run` method of a chain calls the chain one time
- Inherited chains implement the `_call` method to implement chain-specific call logic based on the inputs
- Chain inputs come from inputs that are passed into a chain, and any inputs that come from memory
- Each chain implements an `input_keys` and `output_keys` parameter that describes the type of inputs and outputs expected
  - These inputs are validated at runtime 
- All inputs are passed to the base chain as a dict
- The code is all written in Pydantic which are essentially dataclasses which validate their inputs at runtime
  - These will throw ValidationErrors at object creation time if the inputs are invalid 

### LLM Chains

- These are the foundation of most LangChain object
  - This accepts an `llm` and a `prompt_template`
- Running an llm chain will generate the prompt via the prompt template then call the language model to get a text result

### Combine Documents

- Accepts an `input_documents` parameter and returns an `output_text` output
- Map Reduce
  - Takes a list of documents and calls the LLM on them 
- The `load_summarize_chain` utility function handles instantiating base chains like `MapReduceChain`
- **All of the combine documents chains continue to ask language models to summarize documents to shorten them**
- `MapReduceChain`
  - The `map_reduce_chain` prompt asks to provide a concise summary of the context provided 
  - The `Refine` chain takes an existing summary and asks the LLM to refine it
  - After each individual doc is summarized using the LLM, these summaries are then combined in the `Stuff` combine documents chain
  - This `Stuff` chain then stuffs all the summaries into one prompt to the LLM and asks it to write a summary of it
  - Map: Each document is mapped to its own summary
  - Reduce: Each summary is reduced into one overall summary 
- `StuffDocumentsChain`
  - This performs the second half of the map reduce chain, which summarizes all of the documents. It does not perform the first map step which initially summarizes all of the docs
- `RefineDocumentsChain`
  - This first summarizes all of the documents into one summary
  - It then loops through each of the documents and allows the LLM to update the summary given the existing summary and the doc passed as input

### SQL Database

- Each database has a different prompt that specifies helpful info (e.g. postgres mentions `get_date` and says "You are a PostgreSQL expert".)
- First the chain queries for table/schema info using the database 
- Then the chain executes this query against the database
  - In the more complex use case, another LLM query is used to check the syntax of the generated query
  - This prompt template includes some common mistakes the LLM generated queries make and asks the LLM to resolve it
- You just have to initialize the chain with a SQLAlchemy engine and Langchain will pick the right prompt based on the database dialect and will automatically get
the schema using common sql alchemy functions 

## Agents

- 