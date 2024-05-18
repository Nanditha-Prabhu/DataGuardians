from typing import (
    Dict, 
    Iterable,
    List,
    Optional, 
)

# from googletrans import Translator
# import pandas as pd
from presidio_analyzer import (
    AnalyzerEngine, 
    BatchAnalyzerEngine,
    DictAnalyzerResult
)
from presidio_anonymizer import (
    AnonymizerEngine,
    BatchAnonymizerEngine
)

from .enhance_analyzer import getAnalyzer


# Bad Class name :(
class PIIAnonymizer:
    def __init__(
            self, 
            analyzer_engine: Optional[AnalyzerEngine]=None, 
            anonymizer_engine: Optional[AnonymizerEngine]=None,  
        ) -> None:
        self.analyzer = BatchAnalyzerEngine(analyzer_engine=analyzer_engine)
        self.anonymizer = BatchAnonymizerEngine(anonymizer_engine=anonymizer_engine)
        # self.translator = Translator()

    def __call__(
            self, 
            input_data: Dict[str, List[int|str|float]], 
            language: str='en',
            keys_to_skip: Optional[List[str]]=None
        ) -> Dict[str, List[str]]:
        input_data = {header: str(values) for header, values in input_data.items()}
        # tr_input_data = self._translate(input_data)
        analyzer_results = self._analyze_data(
            data=input_data, 
            language=language, 
            keys_to_skip=keys_to_skip
        )
        anonymizer_results = self._anonymize_data(
            analyzer_results=analyzer_results
        )
        # Here, change the output datatype accor. to requirement
        return anonymizer_results

    # Helper functions
    def _analyze_data(
            self, 
            data: Dict[str, List[int|str|float]], 
            language: str, 
            keys_to_skip: Optional[List[str]]=None, 
            **kwargs,
        ) -> Iterable[DictAnalyzerResult]:
        analyzer_results = self.analyzer.analyze_dict(data, language, keys_to_skip)
        return list(analyzer_results)

    def _anonymize_data(
            self, 
            analyzer_results: Iterable[DictAnalyzerResult]
        ) -> Dict[str, str]:
        return self.anonymizer.anonymize_dict(analyzer_results)

    # def _translate(
    #         self, 
    #         data: Dict[str, List[int|str]],
    #         src_lang: str='auto', 
    #         dest_lang: str='en'
    #     ) -> Dict[str, List[str]]:
    #     if (isinstance(list(data.values())[0], list)):
    #         df = pd.DataFrame(data)
    #         for column in df.columns.tolist():
    #             # Greedy
    #             if (self.translator.detect(df[column][0]).lang != 'en'):
    #                 df[column] = df[column].apply(
    #                     lambda x: self.translator.translate(text=x, dest=dest_lang, src=src_lang).text
    #                 )
    #         return df.to_dict(orient='list')
    
    #     if (isinstance(list(data.values())[0], str)):
    #         for key in data.keys():
    #             data[key] = self.translator.translate(text=data[key], dest=dest_lang, src=src_lang).text
    #         return data


def get_anonymizer():
    analyzer_engine = getAnalyzer()
    anonymizer_engine = AnonymizerEngine()
    
    anonymizer = PIIAnonymizer(
        analyzer_engine=analyzer_engine,
        anonymizer_engine=anonymizer_engine
    )
    return anonymizer


if __name__ == "__main__":
    def test():
        ############## Optional ################
        analyzer_engine = getAnalyzer()
        anonymizer_engine = AnonymizerEngine()
        ########################################

        data = {
            'id': '1',
            'name': 'John',
            'city': 'New York',
            'comments': 'called him yesterday to confirm he requested to call back in 2 days'
        }
        anonymizer = PIIAnonymizer(
            analyzer_engine=analyzer_engine,
            anonymizer_engine=anonymizer_engine
        )
        output = anonymizer(data, keys_to_skip=None)
        print(output)

    test()

