from typing import (
    Dict, 
    Iterable,
    List,
    Optional, 
)

from googletrans import Translator
import pandas as pd
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
        self.translator = Translator()

    def __call__(
            self, 
            input_data: Dict[str, List[int|str|float]], 
            language: str='en',
            keys_to_skip: Optional[List[str]]=None
        ) -> Dict[str, List[str]]:
        input_data = {header: list(map(str, values)) for header, values in input_data.items()}
        tr_input_data = self._translate(input_data)
        analyzer_results = self._analyze_data(
            data=tr_input_data, 
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

    def _translate(
            self, 
            data: Dict[str, List[int|str]],
            src_lang: str='auto', 
            dest_lang: str='en'
        ) -> Dict[str, List[str]]:
        df = pd.DataFrame(data)
        for column in df.columns.tolist():
            # Greedy
            if (self.translator.detect(df[column][0]).lang != 'en'):
                df[column] = df[column].apply(
                    lambda x: self.translator.translate(text=x, dest=dest_lang, src=src_lang).text
                )
        return df.to_dict(orient='list')
    

if __name__ == "__main__":
    def test():
        ############## Optional ################
        analyzer_engine = AnalyzerEngine()
        anonymizer_engine = AnonymizerEngine()
        ########################################

        data = {
            'id': [1, 2, 3],
            'name': ['John', 'Jill', 'Jack'],
            'city': ['New York', 'Los Angeles', 'Chicago'],
            'comments': [
                'called him yesterday to confirm he requested to call back in 2 days',
                'accepted the offer license number AC432223',
                'need to call him at phone number 212-555-5555'],
        }
        anonymizer = PIIAnonymizer(
            analyzer_engine=analyzer_engine,
            anonymizer_engine=anonymizer_engine
        )
        output = anonymizer(data, keys_to_skip=None)
        print(output)

    test()

