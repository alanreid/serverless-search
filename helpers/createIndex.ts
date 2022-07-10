import { DocumentDefinition, SearchDocument } from '../types';
import elasticlunr from 'elasticlunr';
import { array, object, string } from 'yup';

const createDocumentIndex = (documentDefinition: DocumentDefinition, index: elasticlunr.Index<SearchDocument>) => {
  const { searchableFields } = documentDefinition;

  index.setRef('id');

  searchableFields.forEach((field) => {
    index.addField(field);
  });
};

export const createIndex = async (documentDefinition: DocumentDefinition) => {
  const documentDefinitionSchema = object({
    searchableFields: array().of(string().required()).min(1).required(),
  });

  const validatedDocumentDefinition = await documentDefinitionSchema.validate(documentDefinition);

  return elasticlunr<SearchDocument>(function () {
    createDocumentIndex(validatedDocumentDefinition, this);
  });
};
