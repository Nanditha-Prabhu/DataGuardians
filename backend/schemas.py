from pydantic import BaseModel
from typing import List, Dict, Any


# Examples
class PostData(BaseModel):
    name: str
    age: int


class GetData(BaseModel):
    name: str
    age: int


######################### Anonymization #########################
class TestAnonymizeData(BaseModel):
    data: List[Dict[str, str]]


class AnonymizeDataRequest(BaseModel):
    file_name: str
    column_name: List[str]
    anonymize_columns: List[str]


class AnonymizeDataResponse(BaseModel):
    status: str
    data: List[Dict[str, Any]]


########################## MongoDB #########################
class columnNames(BaseModel):
    data: List[str]


######################## SEARCH ##########################
class SearchRequest(AnonymizeDataRequest):
    search_query: str
    search_index: str
    limit: int = 50
