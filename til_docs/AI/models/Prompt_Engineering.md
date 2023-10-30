# Strategies

## Few Shot Prompting

- The order of the examples and the type of exampels can effect model performance
- It can be better to dynamically pull the examples using a k-nn clustering algorithm based on the prompt
- You want to keep the examples diverse but relevant to the prompt and in random order to try to avoid recency bias
- Few shot prompting is expensive in terms of token consumptions so alternatively you can fine-tune a model with these examples

## Instructing Prompting

- Telling the model what to do in clear instructions
    - It's important to tell the model what to do, and avoid saying "not to do something", instead specifying what to do

## Automatic Prompt Design

- Since a prompt is just a sequence of characters used to get the desired output, you can optimize this via gradient descent 
- Automatic Prompt Engineer: One effort in this category of automatic prompt design is to have a model generate candidates and then evaluate those candidates according to a score function 

## RAG

- Add context to queries from a knowledge base so the model can answer
    - You still want to keep the question close to the part of the prompt asking for the answer as this closeness will make the model more likely to produce correct results 
- 