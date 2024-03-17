import csv
import pprint
from typing import List, Iterable, Optional

from presidio_analyzer import BatchAnalyzerEngine, DictAnalyzerResult
from presidio_anonymizer import BatchAnonymizerEngine

"""
Example implementing a CSV analyzer

This example shows how to use the Presidio Analyzer and Anonymizer
to detect and anonymize PII in a CSV file.
It uses the BatchAnalyzerEngine to analyze the CSV file, and 
BatchAnonymizerEngine to anonymize the requested columns.

"""

# -----------This code is not working
# Tharun can update this file with working code
# We must rearrange the directories too

class CSVAnalyzer(BatchAnalyzerEngine):

    def analyze_csv(
        self,
        csv_full_path: str,
        language: str,
        keys_to_skip: Optional[List[str]] = None,
        **kwargs,
    ) -> Iterable[DictAnalyzerResult]:

        with open(csv_full_path, 'r') as csv_file:
            csv_list = list(csv.reader(csv_file))
            csv_dict = {header: list(map(str, values)) for header, *values in zip(*csv_list)}
            analyzer_results = self.analyze_dict(csv_dict, language, keys_to_skip)
            return list(analyzer_results)


if __name__ == "__main__":

    analyzer = CSVAnalyzer()
    analyzer_results = analyzer.analyze_csv('Data Privacy in Law Enforcement/RowdySheeterDetails.csv',
                                            language="en")
    pprint.pprint(analyzer_results)

    anonymizer = BatchAnonymizerEngine()
    anonymized_results = anonymizer.anonymize_dict(analyzer_results)
    pprint.pprint(anonymized_results)